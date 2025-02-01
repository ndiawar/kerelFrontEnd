import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginKerelEcoComponent } from './login-kerel-eco/login-kerel-eco.component';

export const routes: Routes = [
  { path: 'login', component: LoginKerelEcoComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
