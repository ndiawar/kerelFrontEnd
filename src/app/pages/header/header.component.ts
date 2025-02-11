// Importation des modules nécessaires
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/UserServices';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [DatePipe]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  private timer: any;

  @Input() isSidebarVisible: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Vérifie si la plateforme est un navigateur
    if (isPlatformBrowser(this.platformId)) {
      // Met à jour la date toutes les secondes
      this.timer = setInterval(() => {
        this.currentDate = new Date();
      }, 1000);
    }
  }

  ngOnDestroy() {
    // Nettoie l'intervalle lorsque le composant est détruit
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  get formattedDate(): string {
    // Formate la date en utilisant le format spécifié
    return this.datePipe.transform(this.currentDate, 'HH:mm  EEEE, d MMMM y', 'fr-FR') || '';
  }

  logout() {
    this.userService.logout().then(
      response => {
        console.log('Logout successful:', response);
        localStorage.removeItem('user'); // Removes the 'user' item from localStorage
        this.router.navigate(['/login']); // Redirige vers la page de login
      }
    ).catch(
      error => {
        console.error('Logout failed:', error);
      }
    );
  }
}
