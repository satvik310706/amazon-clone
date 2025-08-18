import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { DealerService } from '../../core/services/dealer.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // ✅ Import Toastr

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

  private toastr = inject(ToastrService); // ✅ Inject Toastr
  private router = inject(Router);

  constructor(
    private dealer: DealerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dealer.getStats().subscribe({
      next: (res) => {
        console.log("Dealer Stats:", res);
        this.stats = res;
        this.loading = false;
        this.toastr.success('Dashboard loaded successfully', 'Success'); // ✅ Toast
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to fetch dealer stats', 'Error'); // ✅ Toast
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
