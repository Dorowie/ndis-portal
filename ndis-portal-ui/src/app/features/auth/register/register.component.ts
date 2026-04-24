import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  apiError: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Participant', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.apiError = null;

      const registerData: RegisterRequest = {
        FirstName: this.registerForm.get('firstName')?.value,
        LastName: this.registerForm.get('lastName')?.value,
        Email: this.registerForm.get('email')?.value,
        Password: this.registerForm.get('password')?.value,
        Role: this.registerForm.get('role')?.value
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Registration successful! Please login to continue.');
            this.router.navigate(['/login']);
          } else {
            this.apiError = response.message || 'Registration failed';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.apiError = error.error?.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}