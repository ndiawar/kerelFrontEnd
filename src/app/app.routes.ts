import { Routes } from '@angular/router';
;
import { UserListComponent } from './components/user-list/user-list.component';
import { HistoriqueComponent } from './components/historique/historique.component';

export const routes: Routes = [
  { path: '', redirectTo: '/User-list', pathMatch: 'full' }, // Redirige vers le tableau de bord par défaut
  { path: 'User-list', component: UserListComponent },
  { path: 'historique', component: HistoriqueComponent },
];
