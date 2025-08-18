import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Auth } from '../../core/auth/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  errorMessage = '';
  isLoading: boolean = false; // ✅ Add a new state variable for the loader

  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  signupForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['user'] // default role
  });

  constructor(
    private auth: Auth,
    private router: Router
  ) { }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.toastr.error('Please fill all fields correctly.', 'Validation Error');
      return;
    }

    this.isLoading = true; // ✅ Show the loader

    const formData = this.signupForm.value;

    this.auth.signup(formData).subscribe({
      next: () => {
        this.toastr.success('Signup successful! Please login.', 'Success');
        this.router.navigate(['/login']);
        this.isLoading = false; // ✅ Hide the loader on success
      },
      error: (err) => {
        console.error(err);
        const message = err?.error?.message || 'Signup failed. Please try again.';
        this.toastr.error(message, 'Signup Failed');
        this.errorMessage = message;
        this.isLoading = false; // ✅ Hide the loader on error
      }
    });
  }
}
