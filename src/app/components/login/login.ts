import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  
  loginForm: FormGroup;
  signUpForm: FormGroup;
  showSignUp = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

    async onSubmit() {
    if (this.loginForm.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      try {
        await this.authService.signInWithEmail(email, password);
      } catch (error: any) {
        this.errorMessage = error.message || 'Login failed. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }

  async onSignUp() {
    if (this.signUpForm.valid && !this.loading) {
      const { email, password, confirmPassword } = this.signUpForm.value;

      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      try {
        await this.authService.signUpWithEmail(email, password);
      } catch (error: any) {
        this.errorMessage = error.message || 'Sign up failed. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }

  async signInWithGoogle() {
    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.signInWithGoogle();
    } catch (error: any) {
      this.errorMessage = error.message || 'Google sign in failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}

