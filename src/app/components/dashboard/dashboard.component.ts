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
  // Définition des cartes avec leurs informations dynamiques
  metrics = [
    { icon: '🌊', title: 'Volume Eau', value: '7.90 L', unit: 'Litre (L)' },
    { icon: '💧', title: 'Humidité', value: '85 %', unit: '%HR' },
    { icon: '🌱', title: 'pH du sol', value: '4 0/14', unit: 'Agriculture' },
    { icon: '🌡️', title: 'Temp.', value: '25°C', unit: 'Celsius (°C)' }
  ];

  temperature: number = 0;
  weatherCondition: string = '';
  weatherIcon: string = '';
  cloudiness: number = 0; // Ajout de la couverture nuageuse
  windSpeed: number = 0; // Vitesse du vent
  pressure: number = 0;  // Pression atmosphérique
  weatherAlert: string = '';  // Alerte météo
  humidity: number = 0;  // Ajout de l'humidité

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
        if (data && data.list && data.list.length > 0) {
          const currentWeather = data.list[0];

          this.temperature = currentWeather.main.temp;
          this.weatherCondition = currentWeather.weather[0]?.description || '';
          this.weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0]?.icon}.png`;
          this.humidity = currentWeather.main.humidity;  // Humidité
          this.cloudiness = currentWeather.clouds.all;  // Couverture nuageuse
          this.windSpeed = currentWeather.wind.speed;  // Vitesse du vent
          this.pressure = currentWeather.main.pressure;  // Pression

          // Vérification des conditions météo pour générer une alerte
          if (this.weatherCondition.includes('pluie')) {
            this.weatherAlert = "🌧️ Il risque de pleuvoir, l'arrosage automatique doit être désactivé.";
          } else if (this.weatherCondition.includes('orage')) {
            this.weatherAlert = "⛈️ Attention aux orages, arrosage désactivé.";
          } else if (this.windSpeed > 40) {
            this.weatherAlert = "💨 Vent fort détecté ! Arrosage doit etre réduit pour éviter l'évaporation.";
          } else if (this.weatherCondition.includes('brouillard') || this.weatherCondition.includes('brume')) {
            this.weatherAlert = "🌫️ Brouillard détecté. Vérifiez l'humidité avant d'arroser.";
          }  else if (this.temperature < 20) {
            // Alerte pour les températures froides
            this.weatherAlert = "❄️ Température froide détectée ! L'arrosage doit etre désactivé pour éviter les dommages aux racines.";
          } else if (this.weatherCondition.includes('dégagé') && this.temperature > 29) {
            this.weatherAlert = "☀️ Forte chaleur détectée, augmentation de l'arrosage recommandée.";
          }else if (this.weatherCondition.includes('nuageux')) {
            this.weatherAlert = "☁️ Temps nuageux, surveillez l'humidité.";
          } else {
            this.weatherAlert = "✅ Météo favorable, arrosage normal.";
          }
        } else {
          console.error('Données météo invalides ou vides', data);
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
