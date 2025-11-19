import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideFirebaseApp(() => initializeApp(
      {
        apiKey: "AIzaSyDvfUa6MbfzLyG-ok2mMZKTb_WZFgjOOG8",
        authDomain: "notespwa-a0d12.firebaseapp.com",
        projectId: "notespwa-a0d12",
        storageBucket: "notespwa-a0d12.firebasestorage.app",
        messagingSenderId: "799866199157",
        appId: "1:799866199157:web:9a2120a33586fa773f2c3c"
      }
    )),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
