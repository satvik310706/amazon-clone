import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr import

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image_url: string;
}

interface Stats {
  total_users: number;
  total_products: number;
  total_orders: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  currentTab: 'stats' | 'users' | 'products' = 'stats';

  users: User[] = [];
  products: Product[] = [];
  stats: Stats | null = null;

  loading = false;
  editMode: string | null = null;
  editedProduct: Partial<Product> = {};

  cdr = inject(ChangeDetectorRef);
  toast = inject(ToastrService); // ✅ Inject Toastr
  http = inject(HttpClient);

  private baseUrl = 'https://amazon-clone-fastapi.onrender.com';

  ngOnInit() {
    this.loadStats();
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  switchTab(tab: 'stats' | 'users' | 'products') {
    this.currentTab = tab;
    if (tab === 'stats') this.loadStats();
    if (tab === 'users') this.loadUsers();
    if (tab === 'products') this.loadProducts();
  }

  loadStats() {
    this.loading = true;
    this.http.get<Stats>(`${this.baseUrl}/admin/stats`, {
      headers: this.getHeaders()
    }).subscribe({
      next: data => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('❌ Failed to load stats');
        this.loading = false;
      }
    });
  }

  loadUsers() {
    this.loading = true;
    this.http.get<User[]>(`${this.baseUrl}/admin/users`, {
      headers: this.getHeaders()
    }).subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('❌ Failed to load users');
        this.loading = false;
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.http.get<Product[]>(`${this.baseUrl}/admin/products`, {
      headers: this.getHeaders()
    }).subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('❌ Failed to load products');
        this.loading = false;
      }
    });
  }

  deleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.http.delete(`${this.baseUrl}/admin/delete/${userId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.toast.success('✅ User deleted successfully');
        this.users = this.users.filter(u => u._id !== userId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('❌ Failed to delete user');
      }
    });
  }

  deleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.http.delete(`${this.baseUrl}/admin/products/${productId}`, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.toast.success('✅ Product deleted successfully');
        this.products = this.products.filter(p => p._id !== productId);
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('❌ Failed to delete product');
      }
    });
  }

  startEdit(product: Product) {
    this.editMode = product._id;
    this.editedProduct = { ...product };
  }

  cancelEdit() {
    this.editMode = null;
    this.editedProduct = {};
  }

  saveProduct(productId: string) {
    this.http.put(`${this.baseUrl}/admin/products/${productId}`, this.editedProduct, {
      headers: this.getHeaders()
    }).subscribe({
      next: () => {
        this.toast.success('✅ Product updated successfully');
        this.editMode = null;
        this.loadProducts();
      },
      error: () => {
        this.toast.error('❌ Failed to update product');
      }
    });
  }
}
