import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr import

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  loading: boolean = false;
  error: string | null = null;

  private router = inject(Router);
  private zone = inject(NgZone);
  private cdRef = inject(ChangeDetectorRef);
  private toastr = inject(ToastrService); // ✅ Toastr inject

  constructor(private cs: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cs.getCart().subscribe({
      next: res => {
        this.zone.run(() => {
          this.cartItems = res.cart || [];
          this.totalAmount = res.total_price || 0;
          this.cdRef.detectChanges();
          this.toastr.success('Cart loaded successfully!', 'Success');
        });
      },
      error: err => {
        this.zone.run(() => {
          this.error = err.error?.detail || 'Failed to load cart';
          this.toastr.error(this.error ?? 'Failed to load cart', 'Error loading cart');
        });
        console.error(err);
      }
    });
  }

  removeItem(productId: string): void {
    this.cs.removeItem(productId).subscribe({
      next: () => {
        this.toastr.info('Item removed from cart', 'Removed');
        this.loadCart();
        this.cdRef.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to remove item from cart', 'Error');
      }
    });
  }

  updateQuantity(productId: string, newQty: string | number): void {
    const quantity = typeof newQty === 'string' ? parseInt(newQty) : newQty;
    if (quantity < 1 || isNaN(quantity)) {
      this.toastr.warning('Quantity must be at least 1', 'Invalid Quantity');
      return;
    }

    this.cs.updateItem(productId, quantity).subscribe({
      next: () => {
        this.toastr.success('Quantity updated', 'Success');
        this.loadCart();
        this.cdRef.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to update quantity', 'Error');
      }
    });
  }

  changeQuantity(productId: string, newQty: number): void {
    if (newQty < 1) {
      this.toastr.warning('Quantity cannot be less than 1', 'Invalid Input');
      return;
    }
    this.updateQuantity(productId, newQty);
  }

  goToDashboard() {
    this.router.navigate(['/user']);

  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.toastr.warning("Your cart is empty.", "Checkout Blocked");
      return;
    }

    const hasInvalidIds = this.cartItems.some(item => !item.product_id || item.product_id === 'undefined');
    if (hasInvalidIds) {
      this.toastr.error("One or more items in your cart have invalid product IDs.", "Invalid Cart Items");
      console.error("Cart Items:", this.cartItems);
      return;
    }
    this.cdRef.detectChanges();
    this.loading = true;
    this.cs.checkoutCart().subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Checkout successful!', 'Success');
        this.loadCart();
        this.router.navigate(['/orders']);
        this.loading = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.detail || "Checkout failed. Please try again.", "Error");
        this.loading = false;
        this.router.navigate(['/orders']);
      }
    });
  }
}
