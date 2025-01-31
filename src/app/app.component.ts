import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { CommonModule } from '@angular/common'; // Ajout du CommonModule pour *ngIf
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    CommonModule,
    ],
    standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  showLayout = true; // Contrôle l'affichage du header et du sidebar
  title = 'KerelEcoFront';

  sidebarVisible = false;

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  constructor(private router: Router) {
    // Détection des changements de route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Masquer le layout sur la page de connexion
        this.showLayout = event.url !== '/' && event.url !== '/login';
      }
    });
  }
}
