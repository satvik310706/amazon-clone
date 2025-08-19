import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { DealerService } from '../../core/services/dealer.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dealer-dashboard',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  stats: any = { products: 0, orders: 0 };
  loading = true;

  private toastr = inject(ToastrService);
  private router = inject(Router);

  constructor(
    private dealer: DealerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // ✅ Will fetch once, then reuse cached stats on future visits
    this.dealer.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;

        // Show toast only when first time loading
        if (!this.stats.products && !this.stats.orders) {
          this.toastr.success('Dashboard loaded successfully', 'Success');
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to fetch dealer stats', 'Error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ Manual refresh button
  refreshStats() {
    this.loading = true;
    this.dealer.getStats(true).subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
        this.toastr.info('Stats refreshed');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to refresh stats', 'Error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
