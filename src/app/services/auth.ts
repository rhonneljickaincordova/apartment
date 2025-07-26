import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, getAuth, signInWithRedirect } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  async signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/dashboard']);
  }

  async signUpWithEmail(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate(['/dashboard']);
  }

 async signInWithGoogle(): Promise<void> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return signInWithRedirect(auth, provider);
  }

  async logout() {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
  
}
