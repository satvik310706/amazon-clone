import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile implements OnInit {
  user: any = {};
  private userBackup: any = {}; // Used only for the 'cancel' action

  currentPassword = '';
  isEditing = false;
  loading = true;
  saving = false;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  // A helper to get a unique key for the logged-in user
  private getStorageKey(userId: string): string {
    return `user_profile_changes_${userId}`;
  }

  private get authHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      'Content-Type': 'application/json'
    };
  }

  loadProfile() {
    this.loading = true;
    this.http.get('https://amazon-clone-fastapi.onrender.com/auth/me', { headers: this.authHeaders })
      .subscribe({
        next: (res: any) => {
          // 1. Set the user data from the API response
          this.user = res || {};

          // 2. Check for any locally saved changes
          const savedChanges = localStorage.getItem(this.getStorageKey(this.user.id));
          if (savedChanges) {
            // If changes exist, apply them over the API data
            this.user = JSON.parse(savedChanges);
            console.log('Applied locally persisted profile changes.');
          }

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          console.error('Error fetching profile:', err);
          this.toastr.error('Failed to load profile', 'Error');
          this.cdr.markForCheck();
        }
      });
  }

  editProfile() {
    // Create a backup only for the cancel functionality
    this.userBackup = JSON.parse(JSON.stringify(this.user));
    this.isEditing = true;
  }

  cancelEdit() {
    // Revert to the state before editing was initiated
    this.user = this.userBackup;
    this.isEditing = false;
    this.currentPassword = '';
  }

  saveProfile() {
    if (!this.currentPassword.trim()) {
      this.toastr.error('Password is required to save changes.', 'Validation Error');
      return;
    }

    const payload: any = {};
    const originalUser = this.userBackup;
    let changesMade = false;

    // Build payload with only the fields that have changed
    if (this.user.name?.trim() !== originalUser.name) { payload.username = this.user.name.trim(); changesMade = true; }
    if (this.user.address?.trim() !== originalUser.address) { payload.address = this.user.address.trim(); changesMade = true; }
    if (this.user.phone?.trim() !== originalUser.phone) {
      const phone = String(this.user.phone).trim();
      if (!/^\d{10}$/.test(phone)) { this.toastr.warning('Phone must be exactly 10 digits', 'Validation'); return; }
      payload.phone = phone;
      changesMade = true;
    }

    if (!changesMade) {
      this.toastr.info('You haven\'t made any changes.', 'Profile');
      this.isEditing = false;
      this.currentPassword = '';
      return;
    }

    // --- Instant UI Update and Persistence ---
    this.saving = true;
    this.isEditing = false;

    // 1. Save the entire updated user object to localStorage
    localStorage.setItem(this.getStorageKey(this.user.id), JSON.stringify(this.user));

    // 2. Send the update to the backend
    payload.password = this.currentPassword;
    this.http.put('https://amazon-clone-fastapi.onrender.com/auth/update', payload, { headers: this.authHeaders })
      .subscribe({
        next: () => {
          this.toastr.success('Profile updated and saved!', 'Success');
          this.saving = false;
          this.currentPassword = '';
          // Optional: You could reload from the API here, but keeping the local version ensures consistency for the user.
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.saving = false;
          this.currentPassword = '';
          const detailMsg = err?.error?.detail?.[0]?.msg || 'The server could not be reached.';
          console.log(`Your changes are saved on this device but failed to sync with the server: ${detailMsg}`, 'Sync Warning');
          this.cdr.markForCheck();
        }
      });
  }
}