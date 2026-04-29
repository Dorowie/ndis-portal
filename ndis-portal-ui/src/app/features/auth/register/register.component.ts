import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService} from '../../../core/services/auth.services';
import { RegisterRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
          if (response.success && response.data?.token) {
            // Registration returned token - auto-login
            this.handleLoginSuccess(response.data.token);
          } else if (response.success) {
            // Registration succeeded but no token - auto-login with credentials
            this.authService.login(registerData.Email, registerData.Password).subscribe({
              next: (loginResponse) => {
                if (loginResponse.success && loginResponse.data?.token) {
                  this.handleLoginSuccess(loginResponse.data.token);
                } else {
                  this.apiError = loginResponse.message || 'Auto-login failed. Please login manually.';
                  this.isLoading = false;
                }
              },
              error: (loginError) => {
                console.error('Auto-login error:', loginError);
                this.apiError = 'Registration successful. Please login to continue.';
                this.isLoading = false;
              }
            });
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

  handleLoginSuccess(token: string) {
    // Auto-login: store token and user data
    localStorage.setItem('token', token);
    localStorage.removeItem('user'); // Clear stale user data

    // Get user role from token
    const role = this.authService.getUserRole(token);

    // Redirect based on role
    if (role === 'Coordinator') {
      this.router.navigate(['/dashboard']);
    } else {
      // Default to /services for Participant or any other role
      this.router.navigate(['/services']);
    }
  }
}