import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UtilisateursComponent } from './components/utilisateurs/utilisateurs.component';
import { HistoriqueComponent } from './components/historique/historique.component';
import { ArrosageComponent } from './components/arrosage/arrosage.component'
import { UserListComponent } from './components/user-list/user-list.component';



// Définissez vos itinéraires ici. Chaque route doit correspondre à un composant.
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'utilisateurs', component: UtilisateursComponent },
    { path: 'User-list', component: UserListComponent },
    { path: 'historique', component: HistoriqueComponent },
    { path: 'arrosage', component: ArrosageComponent },
    { path: 'historique', component: HistoriqueComponent },
];
