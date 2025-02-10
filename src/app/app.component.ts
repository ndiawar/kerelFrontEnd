import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { CommonModule } from '@angular/common'; // Pour *ngIf
import { ArrosageService } from './services/arrosage.service';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showLayout = true; // Affichage du header et sidebar
  title = 'KerelEcoFront';
  sidebarVisible = false;
  statusMessage: string = 'Initialisation...';

  isBrowser: boolean;

  constructor(
    private arrosageService: ArrosageService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showLayout = event.url !== '/' && event.url !== '/login';
      }
    });
  }
  ngOnInit() {
    if (this.isBrowser) {
      // Démarrer la vérification APRÈS le rendu du navigateur
      setTimeout(() => {
        this.arrosageService.startArrosageCheck();
      }, 2000);
    }
  }


  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
