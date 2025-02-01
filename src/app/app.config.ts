<<<<<<< HEAD
import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { routes } from './app.routes';

// Enregistrer les données de locale français
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};
=======
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Importez vos routes

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes) // Configurez le routeur ici
  ]
};
>>>>>>> 925fdc6583d7420591d8bd49de8177ab2b404d15
