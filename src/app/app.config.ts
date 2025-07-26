import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideFirebaseApp(() => 
      initializeApp(
      { 
        projectId: "apartment-a469a", 
        appId: "1:1065107610232:web:7475e4886219de53852b8d", 
        storageBucket: "apartment-a469a.firebasestorage.app", 
        apiKey: "AIzaSyDpcMcZUwOWzgIKWjXI3SwLFH8pzcia_ws", 
        authDomain: "apartment-a469a.firebaseapp.com", 
        messagingSenderId: "1065107610232", 
        measurementId: "G-9LW3GRDQ7K" 
      })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
