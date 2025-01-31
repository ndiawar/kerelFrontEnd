import { Routes } from '@angular/router';
import { LoginKerelEcoComponent } from './login-kerel-eco/login-kerel-eco.component';

export const routes: Routes = [
  { path: 'login', component: LoginKerelEcoComponent }, // Route pour afficher le composant LoginComponent
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige la route racine vers /login
  { path: '**', redirectTo: '/login' } // Redirige toutes les routes inconnues vers /login
];
