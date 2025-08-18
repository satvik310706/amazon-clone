import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Auth } from '../../core/auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false; // ✅ Add a new state variable for the loader

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill in all fields correctly.', 'Validation Error');
      return;
    }

    this.isLoading = true; // ✅ Show the loader

    const { email, password } = this.loginForm.value;
    this.errorMessage = '';

    this.auth.login(email, password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.access_token);

        const decoded = this.auth.getDecodedToken();
        if (decoded?.role) {
          localStorage.setItem('role', decoded.role);

          this.toastr.success('Login successful! Redirecting...', 'Welcome');

          if (decoded.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (decoded.role === 'dealer') {
            this.router.navigate(['/dealer/dashboard']);
          } else {
            this.router.navigate(['/user']);
          }
        } else {
          this.toastr.error('Invalid token received. Please try again.', 'Authentication Error');
        }
        this.isLoading = false; // ✅ Hide the loader on success
      },
      error: (err: any) => {
        const message = err?.error?.message || 'Login failed. Please try again.';
        this.toastr.error(message, 'Login Failed');
        this.errorMessage = message;
        this.isLoading = false; // ✅ Hide the loader on error
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}