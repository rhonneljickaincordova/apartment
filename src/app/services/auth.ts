import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  user,
  User,
  onAuthStateChanged
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  
  // Observable for user state
  user$: Observable<User | null> = user(this.auth);
  
  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Monitor authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.isAuthenticatedSubject.next(!!user);
    });
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      if (result.user) {
        await this.router.navigate(['']);
      }
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string): Promise<void> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      if (result.user) {
        await this.router.navigate(['']);
      }
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes if needed
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(this.auth, provider);
      if (result.user) {
        await this.router.navigate(['']);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  // Get current user's UID
  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // Get current user's email
  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  // Check if user email is verified
  isEmailVerified(): boolean {
    return this.auth.currentUser?.emailVerified || false;
  }
}