import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Importer les routes définies
import { HttpClientModule } from '@angular/common/http'; // Importer le module HttpClient

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    HttpClientModule // Ajouter HttpClientModule dans les providers
  ],
}).catch(err => console.error(err));
