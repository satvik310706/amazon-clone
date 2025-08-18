import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DealerService } from '../../core/services/dealer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr import

@Component({
  selector: 'app-dealer-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dealer-products.html',
  styleUrl: './dealer-products.css'
})
export class DealerProducts implements OnInit {
  cdr = inject(ChangeDetectorRef);
  dealer = inject(DealerService);
  toastr = inject(ToastrService); // ✅ Toastr injection

  products: any[] = [];
  loading = true;

  newProduct = {
    title: '',
    price: 0,
    quantity: 0,
    category: '',
    image_url: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.dealer.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;
        this.loading = false;
        this.toastr.success('Products loaded successfully', 'Success'); // ✅ Success toast
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("❌ Error fetching products", err);
        this.toastr.error('Failed to load products', 'Error'); // ❌ Error toast
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createProduct() {
    const { title, price, quantity, category, image_url, description } = this.newProduct;

    if (
      !title.trim() || !category.trim() || !image_url.trim() || !description.trim() ||
      price <= 0 || quantity <= 0
    ) {
      this.toastr.warning('All fields are required and must be valid (price/quantity > 0)', 'Validation Error'); // ⚠️ Warning toast
      return;
    }

    this.dealer.createProduct(this.newProduct).subscribe({
      next: () => {
        this.toastr.success('Product created successfully!', 'Success'); // ✅
        this.newProduct = { title: '', price: 0, quantity: 0, category: '', image_url: '', description: '' };
        this.loadProducts();
      },
      error: () => {
        this.toastr.error('Failed to create product', 'Error'); // ❌
      }
    });
  }

  deleteProduct(id: string) {
    this.dealer.deleteProduct(id).subscribe({
      next: () => {
        this.toastr.success('Product deleted successfully', 'Deleted'); // ✅
        this.loadProducts();
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to delete product', 'Error'); // ❌
        this.cdr.detectChanges();
      }
    });
  }

  updateProduct(p: any) {
    const updated = {
      title: p.title,
      price: p.price,
      quantity: p.quantity,
      category: p.category,
      image_url: p.image_url,
      description: p.description
    };

    this.dealer.updateProduct(p._id, updated).subscribe({
      next: () => {
        this.toastr.success('Product updated successfully', 'Updated'); // ✅
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to update product', 'Error'); // ❌
        this.cdr.detectChanges();
      }
    });
  }
}
