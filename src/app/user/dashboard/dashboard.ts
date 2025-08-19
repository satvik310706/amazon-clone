import { Component, inject, OnInit, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchQuery = '';
  isLoading: boolean = true;

  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private router = inject(Router);
  private zone = inject(NgZone);
  private toast = inject(ToastrService);

  private apiUrl = 'https://amazon-clone-fastapi.onrender.com/products';

  // ✅ Static cache to persist products across component instances
  private static productsCache: any[] | null = null;

  ngOnInit(): void {
    this.isLoading = true;

    if (Dashboard.productsCache) {
      // ✅ Use cached data if available
      this.products = Dashboard.productsCache;
      this.filteredProducts = [...Dashboard.productsCache];
      this.categories = Array.from(new Set(Dashboard.productsCache.map(p => p.category)));
      this.isLoading = false;
      this.cdr.detectChanges();
    } else {
      // ✅ Fetch from API if cache is empty
      this.http.get<any[]>(this.apiUrl).subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.products = res;
            this.filteredProducts = [...res];
            this.categories = Array.from(new Set(res.map(p => p.category)));
            // store in static cache
            Dashboard.productsCache = res;
            this.isLoading = false;
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          console.error('❌ Error fetching products:', err);
          this.toast.error('Failed to fetch products ❌', 'Error');
          this.isLoading = false;
        }
      });
    }
  }

  filterProducts(): void {
    const s = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.title.toLowerCase().includes(s) &&
      (!this.selectedCategory || p.category === this.selectedCategory)
    );
  }

  forceFilter(): void {
    setTimeout(() => this.filterProducts(), 0);
  }

  onAddToCart(product: any): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toast.warning('⚠️ Please log in to add items to cart', 'Login Required');
      return;
    }

    const productId = product.id || product._id?.$oid || product._id;
    if (!productId) {
      this.toast.error('❌ Invalid product ID', 'Error');
      return;
    }

    const body = { product_id: productId, quantity: 1 };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('https://amazon-clone-fastapi.onrender.com/cart/add', body, { headers })
      .subscribe({
        next: () => {
          this.toast.success('✅ Product added to cart!', 'Success');
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('❌ Add to cart error:', err);
          this.router.navigate(['/cart']);
        }
      });
  }
}
