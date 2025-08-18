import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { DealerService } from '../../core/services/dealer.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // ✅ Toast import

@Component({
  selector: 'app-dealer-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, NgForOf, NgIf],
  templateUrl: './dealer-orders.html',
  styleUrl: './dealer-orders.css'
})
export class DealerOrders implements OnInit {
  orders: any[] = [];
  loading: boolean = true;

  private toastr = inject(ToastrService); // ✅ Inject Toastr

  constructor(
    private dealer: DealerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dealer.getOrders().subscribe({
      next: (res: any) => {
        console.log("Dealer Orders Loaded:", res);
        this.orders = res;
        this.loading = false;
        this.toastr.success('Orders loaded successfully', 'Success'); // ✅ Toast
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Order Fetch Error:", err);
        this.toastr.error('Failed to load orders', 'Error'); // ✅ Toast
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
