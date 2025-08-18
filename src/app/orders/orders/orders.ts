import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/orders.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // ✅ Import Toastr

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: any[] = [];
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService // ✅ Inject ToastrService
  ) { }

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        this.toastr.success('🧾 Orders loaded successfully', 'Success');
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.detail || 'Failed to load orders.';
        this.error = msg;
        this.toastr.error(msg, 'Error Loading Orders');
        console.error("❌ Error fetching orders:", err);
      }
    });
  }

  getFormattedDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }
}
