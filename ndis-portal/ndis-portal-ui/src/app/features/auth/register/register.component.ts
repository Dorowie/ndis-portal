import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  apiError: string | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      agreeToTerms: [false, Validators.requiredTrue] // Dapat naka-check ito!
    });
  }

  
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 
  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      console.log('Form Data Ready for API:', this.registerForm.value);
      
     
      setTimeout(() => {
        this.isLoading = false;
        alert('Form is valid and ready to submit to backend!');
      }, 1000);

    } else {
      
      this.registerForm.markAllAsTouched();
    }
  }
}