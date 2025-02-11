import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UtilisateursComponent } from './components/utilisateurs/utilisateurs.component';
import { HistoriqueComponent } from './components/historique/historique.component';
import { ArrosageComponent } from './components/arrosage/arrosage.component'
import { UserListComponent } from './components/user-list/user-list.component';
import { LoginKerelEcoComponent } from './pages/login-kerel-eco/login-kerel-eco.component';
import { AuthGuard } from './guards/auth.guard';



// Définissez vos itinéraires ici. Chaque route doit correspondre à un composant.
export const routes: Routes = [
    { path: '', component: LoginKerelEcoComponent },
    { path: 'login', component: LoginKerelEcoComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'utilisateurs', component: UtilisateursComponent, canActivate: [AuthGuard] },
    { path: 'User-list', component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'historique', component: HistoriqueComponent, canActivate: [AuthGuard] },
    { path: 'arrosage', component: ArrosageComponent, canActivate: [AuthGuard] },
    { path: 'historique', component: HistoriqueComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];
