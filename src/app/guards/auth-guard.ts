import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, onAuthStateChanged, user } from '@angular/fire/auth';
import { map } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
   const auth = inject(Auth);
  const router = inject(Router);

  // return new Promise<boolean | import('@angular/router').UrlTree>((resolve) => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     unsubscribe();
  //     resolve(user ? true : router.createUrlTree(['/login']));
  //   });
  // });

  return user(auth).pipe(
    map(currentUser => {
      console.log("user:", currentUser)
      if (currentUser) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};
