import {
  OnInit,
  OnDestroy,
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { MeteoService } from '../../services/meteo.service';  // Import du service météo
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

  temperature: number = 0;
  weatherCondition: string = '';
  weatherIcon: string = '';

  constructor(
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private meteoService: MeteoService  // Injection du service météo
  ) {}

  ngOnInit() {
    // Vérifie si la plateforme est un navigateur
    if (isPlatformBrowser(this.platformId)) {
      // Met à jour la date toutes les secondes
      this.timer = setInterval(() => {
        this.currentDate = new Date();
      }, 1000);

      // Récupère la météo de Dakar
      this.getWeather();
    }
  }

  ngOnDestroy() {
    // Nettoie l'intervalle lorsque le composant est détruit
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  private getWeather(): void {
    this.meteoService.getWeather().then(
      (data) => {
        // Vérifie si la liste de prévisions est disponible
        if (data && data.list && data.list.length > 0) {
          // Prend la première prévision dans la liste (qui pourrait être la météo actuelle)
          const currentWeather = data.list[0]; // ou data.list[0] pour récupérer la première prévision
          this.temperature = currentWeather.main.temp;
          this.weatherCondition = currentWeather.weather[0]?.description || '';
          this.weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0]?.icon}.png`;
        } else {
          console.error('Données météo invalides ou vide', data);
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de la météo', error);
      }
    );
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
