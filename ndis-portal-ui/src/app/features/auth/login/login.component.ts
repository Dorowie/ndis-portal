import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  apiError: string | null = null;
  fieldErrors: { [key: string]: string } = {};
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return `${this.formatFieldName(fieldName)} is required`;
      }
      if (control.errors?.['email']) {
        return 'Please enter a valid email address';
      }
    }
    return this.fieldErrors[fieldName] || '';
  }

  formatFieldName(fieldName: string): string {
    const names: { [key: string]: string } = {
      email: 'Email',
      password: 'Password'
    };
    return names[fieldName] || fieldName;
  }

  onSubmit(): void {
    this.fieldErrors = {};

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      // Collect validation errors
      const errors: { [key: string]: string } = {};
      Object.keys(this.loginForm.controls).forEach(key => {
        const error = this.getFieldError(key);
        if (error) {
          errors[key] = error;
        }
      });
      this.fieldErrors = errors;
      this.apiError = Object.keys(errors).length > 0 
        ? 'Please correct the highlighted fields below.' 
        : 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.apiError = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const token = response.data.token;
          localStorage.setItem('token', token);
          
          const userRole = this.authService.getUserRole(token);
          // Store role for sidebar to detect user type
          localStorage.setItem('userRole', userRole || 'Participant');
          
          if (userRole === 'Coordinator') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/services']);
          }
        } else {
          this.apiError = response.message || 'Login failed';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('=== LOGIN ERROR ===');
        console.error('Full error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.error?.message);
        console.error('Error errors:', error.error?.errors);
        
        // Handle field-specific errors from API
        if (error.error?.errors && Array.isArray(error.error.errors)) {
          const fieldErrorMap: { [key: string]: string } = {};
          error.error.errors.forEach((err: any) => {
            if (err.field) {
              fieldErrorMap[err.field.toLowerCase()] = err.message;
            }
          });
          this.fieldErrors = fieldErrorMap;
          this.apiError = 'Please correct the highlighted fields below.';
        } else if (error.error?.errors && typeof error.error.errors === 'object') {
          // Handle object-style errors { field: [messages] }
          const fieldErrorMap: { [key: string]: string } = {};
          Object.keys(error.error.errors).forEach(key => {
            const messages = error.error.errors[key];
            fieldErrorMap[key.toLowerCase()] = Array.isArray(messages) ? messages[0] : messages;
          });
          this.fieldErrors = fieldErrorMap;
          this.apiError = 'Please correct the highlighted fields below.';
        } else {
          const errorMessage = error.error?.message || 'Invalid login credentials';
          const errorMessageLower = errorMessage.toLowerCase();
          
          // Check if error is password-related
          if (errorMessageLower.includes('password')) {
            this.fieldErrors['password'] = 'Incorrect password';
            this.apiError = 'Please correct the highlighted fields below.';
          } 
          // Check if error is email-related
          else if (errorMessageLower.includes('email') || errorMessageLower.includes('user') || errorMessageLower.includes('account')) {
            this.fieldErrors['email'] = 'Invalid email or incorrect email';
            this.apiError = 'Please correct the highlighted fields below.';
          } else {
            this.apiError = errorMessage;
          }
        }
        
        this.isLoading = false;
      }
    });
  }
}