import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/core/loader';

// Initialize Firebase with explicit configuration
const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
  measurementId: environment.firebase.measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Ionic custom elements
defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      mode: 'md' // Use Material Design for Android
    }),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(IonicModule.forRoot({
      mode: 'md' // Use Material Design for Android
    }))
  ],
}).catch(err => console.error('Error bootstrapping app:', err));
