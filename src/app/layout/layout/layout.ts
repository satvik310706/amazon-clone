import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Auth } from '../../core/auth/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // ✅ Import toastr

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit {
  username: string | null = null;
  isLoggedIn = false;
  userRole: string | null = null;

  private toastr = inject(ToastrService); // ✅ Inject toastr

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoggedIn = auth.isLoggedIn();
    this.userRole = auth.getUserRole();
  }

  ngOnInit() {
    this.username = localStorage.getItem('role');
  }

  logout() {
    try {
      this.auth.logout();
      this.toastr.success('Logged out successfully', 'Goodbye!');
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Logout error:', err);
      this.toastr.error('Something went wrong while logging out', 'Error');
    }
  }

  goToCart() {
    try {
      this.router.navigate(['/cart']);
      this.toastr.info('Navigating to cart...', 'Cart');
      this.cdr.detectChanges();
    } catch (err) {
      this.toastr.error('Unable to navigate to cart', 'Navigation Error');
    }
  }

  isUser(): boolean {
    return this.userRole === 'user';
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  isDealer(): boolean {
    return this.userRole === 'dealer';
  }
}
