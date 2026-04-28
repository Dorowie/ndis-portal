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
          console.log('Registration response:', response);
          console.log('Role from form:', registerData.Role);
          if (response.success) {
            alert('Registration successful!');
            // Store token if returned by API
            if (response.data && response.data.token) {
              localStorage.setItem('token', response.data.token);
            }
            // Store role for sidebar to detect user type
            localStorage.setItem('userRole', registerData.Role);
            // Notify sidebar of role change
            window.dispatchEvent(new StorageEvent('storage', { key: 'userRole' }));
            // Redirect based on role
            const role = registerData.Role?.trim();
            console.log('Navigating based on role:', role);
            if (role === 'Coordinator') {
              console.log('Redirecting to /dashboard');
              this.router.navigate(['/dashboard']).then(
                () => console.log('Navigation to dashboard successful'),
                (err) => console.error('Navigation to dashboard failed:', err)
              );
            } else if (role === 'Participant') {
              console.log('Redirecting to /services');
              this.router.navigate(['/services']).then(
                () => console.log('Navigation to services successful'),
                (err) => console.error('Navigation to services failed:', err)
              );
            } else {
              console.error('Unknown role, defaulting to /services:', role);
              this.router.navigate(['/services']);
            }
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