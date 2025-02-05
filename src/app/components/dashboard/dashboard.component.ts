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
import { WebSocketService } from '../../services/websocket.service'; // Importer le service WebSocket

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
 // Définition des cartes avec des valeurs initiales vides
 metrics = [
  { icon: '🌊', title: 'Volume Eau', value: '...', unit: 'Litre (L)' },
  { icon: '💧', title: 'Humidité', value: '...', unit: '%HR' },
  { icon: '🌱', title: 'pH du sol', value: '...', unit: 'Agriculture' },
  { icon: '🌡️', title: 'Temp.', value: '...', unit: 'Celsius (°C)' }
];


  temperature: number = 0;
  weatherCondition: string = '';
  weatherIcon: string = '';
  cloudiness: number = 0; // Ajout de la couverture nuageuse
  windSpeed: number = 0; // Vitesse du vent
  pressure: number = 0;  // Pression atmosphérique
  weatherAlert: string = '';  // Alerte météo
  humidity: number = 0;  // Ajout de l'humidité



  // Propriétés pour stocker les données des capteurs
  temperature_sensor: number | null = null;
  ph: number | null = null;
  humidity_sensor: number | null = null;
  waterVolume: number | null = null;


  constructor(
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private meteoService: MeteoService,  // Injection du service météo
    private webSocketService: WebSocketService // Injecter le service WebSocket
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

      // Connexion au WebSocket pour recevoir les données des capteurs
      this.webSocketService.connect('ws://localhost:8080').subscribe(data => {
        this.temperature_sensor = data.temperature || null;
        this.ph = data.ph || null;
        this.humidity_sensor = data.humidity || null;
        this.waterVolume = data.water_level || null;

        // Mettez à jour les métriques avec les données reçues
        this.updateMetrics();
      });
    }
  }

  ngOnDestroy() {
    // Nettoie l'intervalle lorsque le composant est détruit
    if (this.timer) {
      clearInterval(this.timer);
    }

    // Fermer la connexion WebSocket lors de la destruction du composant
    this.webSocketService.close();
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


  private updateMetrics() {
    // Mettez à jour les valeurs dynamiques des métriques
    this.metrics = [
      { icon: '🌊', title: 'Volume Eau', value: this.waterVolume !== null ? `${this.waterVolume} L` : '...', unit: 'Litre (L)' },
      { icon: '💧', title: 'Humidité', value: this.humidity_sensor !== null ? `${this.humidity_sensor} %` : '...', unit: '%HR' },
      { icon: '🌱', title: 'pH du sol', value: this.ph !== null ? `${this.ph}` : '...', unit: 'Agriculture' },
      { icon: '🌡️', title: 'Temp.', value: this.temperature_sensor !== null ? `${this.temperature_sensor}°C` : '...', unit: 'Celsius (°C)' }
    ];
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
