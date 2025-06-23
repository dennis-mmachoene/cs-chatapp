import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  email!: string;
  password!: string;
  userName!: string;
  fullName!: string;
  profilePicture: string = 'https://randomuser.me/api/portraits/lego/5.jpg';
  profileImage: File | null = null;

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  hide = signal(true);
  isLoading = signal(false);

  togglePassword(event: MouseEvent) {
    event.preventDefault();
    this.hide.set(!this.hide());
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log("File selected:", file); // Add this line
    if (file) {
      this.profileImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicture = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  register() {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    let formData = new FormData();
    formData.append("email", this.email);
    formData.append('password', this.password);
    formData.append('fullName', this.fullName);
    formData.append('userName', this.userName);
    if (!this.profileImage) {
      this.snackBar.open("Please upload a profile image", "Close", {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.isLoading.set(false);
      return;
    }
    formData.append('profileImage', this.profileImage);

    this.authService.register(formData).subscribe({
      next: () => {
        this.snackBar.open('Welcome! Account created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error: HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error || 'Registration failed', "Close", {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      }
    });
  }
}