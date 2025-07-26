import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth, getAuth, getRedirectResult, onAuthStateChanged } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('rentpro-app');
  auth: Auth = inject(Auth); // 👈 inject AngularFire auth
  constructor(
    private router: Router
  ) {

  }
  async ngOnInit() {
    try {
      const auth = this.auth
      onAuthStateChanged(this.auth, async (user) => {
        const result = await getRedirectResult(this.auth);
        console.log("--->", result);
        if (result?.user || user) {
          this.router.navigate(['/']);
        }
      });
    } catch (error) {
      console.error('Google login failed:', error);
    }
  }
}
