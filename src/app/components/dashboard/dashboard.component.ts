import {
  OnInit,
  OnDestroy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { LogAccordionComponent } from '../log-accordion/log-accordion.component';
import { GraphsComponent } from '../graphs/graphs.component'; //

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LogAccordionComponent, GraphsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  private timer: any;
  private userLocale: string = 'fr-FR';  // Par défaut, on commence avec 'fr-FR'

  constructor(
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit() {
    // Vérifie si la plateforme est un navigateur
    if (isPlatformBrowser(this.platformId)) {
      // Récupère la géolocalisation pour déterminer la langue
      this.detectUserLocation();

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

  // Détecte la position géographique et définit la locale
  private detectUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Utilisation des données de position pour ajuster la locale
        this.setLocaleBasedOnPosition(position);
      });
    }
  }

  // Exemple d'implémentation de changement de locale basé sur la position
  private setLocaleBasedOnPosition(position: GeolocationPosition): void {
    // Ici, tu pourrais utiliser des API externes pour obtenir la localisation (comme une API de géolocalisation inversée)
    const country = position.coords.latitude > 45 ? 'fr-FR' : 'en-US';  // Juste un exemple basé sur la latitude
    this.userLocale = country;
  }

  // Récupère l'heure formatée selon la locale détectée
  get formattedTime(): string {
    return this.datePipe.transform(this.currentDate, 'HH:mm', this.userLocale) || '';
  }

  // Récupère le jour de la semaine selon la locale détectée
  get formattedDay(): string {
    return this.datePipe.transform(this.currentDate, 'EEEE', this.userLocale) || '';
  }

  // Récupère la date selon la locale détectée
  get formattedDate(): string {
    return this.datePipe.transform(this.currentDate, 'd MMMM y', this.userLocale) || '';
  }
}
