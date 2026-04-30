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
  fieldErrors: { [key: string]: string } = {};
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

  getFieldError(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return `${this.formatFieldName(fieldName)} is required`;
      }
      if (control.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors?.['minlength']) {
        return `Password must be at least ${control.errors?.['minlength'].requiredLength} characters`;
      }
    }
    return this.fieldErrors[fieldName] || '';
  }

  formatFieldName(fieldName: string): string {
    const names: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      role: 'Role',
      password: 'Password',
      agreeToTerms: 'Terms agreement'
    };
    return names[fieldName] || fieldName;
  }

  onSubmit() {
    this.fieldErrors = {};
    
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
          console.log('=== REGISTRATION DEBUG ===');
          console.log('Full response:', response);
          console.log('Response success:', response.success);
          console.log('Response data:', response.data);
          console.log('Response message:', response.message);
          console.log('Role from form:', registerData.Role);
          
          if (response.success) {
            alert('Registration successful! Logging you in...');
            
            // Auto-login after registration to get a token
            this.authService.login(registerData.Email, registerData.Password).subscribe({
              next: (loginResponse) => {
                console.log('=== AUTO-LOGIN DEBUG ===');
                console.log('Login response:', loginResponse);
                
                if (loginResponse.success && loginResponse.data) {
                  const token = loginResponse.data.token;
                  localStorage.setItem('token', token);
                  console.log('Token stored from auto-login');
                  
                  const userRole = this.authService.getUserRole(token);
                  localStorage.setItem('userRole', userRole || registerData.Role);
                  console.log('User role from token:', userRole);
                  
                  // Store user info
                  const userInfo = {
                    firstName: registerData.FirstName,
                    lastName: registerData.LastName,
                    email: registerData.Email,
                    role: registerData.Role
                  };
                  localStorage.setItem('user', JSON.stringify(userInfo));
                  console.log('Stored user info:', userInfo);
                  
                  // Notify sidebar of role change
                  window.dispatchEvent(new StorageEvent('storage', { key: 'userRole' }));
                  
                  // Redirect based on role
                  const role = (userRole || registerData.Role)?.trim();
                  console.log('Navigating based on role:', role);
                  
                  if (role === 'Coordinator') {
                    console.log('Redirecting to /dashboard');
                    this.router.navigate(['/dashboard']).then(
                      () => {
                        console.log('Navigation to dashboard successful');
                        this.isLoading = false;
                      },
                      (err) => {
                        console.error('Navigation to dashboard failed:', err);
                        this.isLoading = false;
                      }
                    );
                  } else {
                    console.log('Redirecting to /services');
                    this.router.navigate(['/services']).then(
                      () => {
                        console.log('Navigation to services successful');
                        this.isLoading = false;
                      },
                      (err) => {
                        console.error('Navigation to services failed:', err);
                        this.isLoading = false;
                      }
                    );
                  }
                } else {
                  console.error('Auto-login failed:', loginResponse.message);
                  // Fallback to login page
                  this.router.navigate(['/login']);
                  this.isLoading = false;
                }
              },
              error: (loginError) => {
                console.error('Auto-login error:', loginError);
                // Fallback to login page
                this.router.navigate(['/login']);
                this.isLoading = false;
              }
            });
          } else {
            console.error('Registration not successful:', response.message);
            this.apiError = response.message || 'Registration failed';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('=== REGISTRATION ERROR ===');
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
            this.apiError = error.error?.message || 'Registration failed. Please try again.';
          }
          
          this.isLoading = false;
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
      // Collect validation errors
      const errors: { [key: string]: string } = {};
      Object.keys(this.registerForm.controls).forEach(key => {
        const error = this.getFieldError(key);
        if (error) {
          errors[key] = error;
        }
      });
      this.fieldErrors = errors;
      this.apiError = Object.keys(errors).length > 0 
        ? 'Please correct the highlighted fields below.' 
        : 'Please fill in all required fields.';
    }
  }
}