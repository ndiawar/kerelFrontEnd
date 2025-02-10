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
import { CapteurService } from '../../services/capteur.service';  // Importer le service Capteur

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
  metrics = [
    { icon: '🌊', title: 'Volume Eau', value: '...', unit: 'Litre (L)' },
    { icon: '💧', title: 'Humidité', value: '...', unit: '%HR' },
    { icon: '🌱', title: 'pH du sol', value: '...', unit: 'Agriculture' },
    { icon: '🌡️', title: 'Temp.', value: '...', unit: 'Celsius (°C)' }
  ];

  temperature: number = 0;
  weatherCondition: string = '';
  weatherIcon: string = '';
  cloudiness: number = 0;
  windSpeed: number = 0;
  pressure: number = 0;
  weatherAlert: string = '';
  humidity: number = 0;

  // Propriétés pour stocker les données des capteurs
  temperature_sensor: number | null = null;
  ph: number | null = null;
  humidity_sensor: number | null = null;
  waterLevel: number | null = null;

  constructor(
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private meteoService: MeteoService,  // Injection du service météo
    private capteurService: CapteurService  // Injection du service Capteur
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.timer = setInterval(() => {
        this.currentDate = new Date();
      }, 1000);

      this.getWeather();

      // Récupérer les données des capteurs toutes les 5 secondes
      this.capteurService.getRealTimeSensorData().subscribe(data => {
        this.temperature_sensor = data.temperature || null;
        this.ph = data.ph || null;
        this.humidity_sensor = data.humidity || null;
        this.waterLevel = data.waterLevel || null;

        // Mettre à jour l'affichage
        this.updateMetrics();
      });
    }
  }

  ngOnDestroy() {
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
          this.humidity = currentWeather.main.humidity;
          this.cloudiness = currentWeather.clouds.all;
          this.windSpeed = currentWeather.wind.speed;
          this.pressure = currentWeather.main.pressure;

          if (this.weatherCondition.includes('pluie')) {
            this.weatherAlert = "🌧️ Il risque de pleuvoir, l'arrosage automatique doit être désactivé.";
          } else if (this.weatherCondition.includes('orage')) {
            this.weatherAlert = "⛈️ Attention aux orages, arrosage désactivé.";
          } else if (this.windSpeed > 40) {
            this.weatherAlert = "💨 Vent fort détecté ! Arrosage doit etre réduit pour éviter l'évaporation.";
          } else if (this.weatherCondition.includes('brouillard') || this.weatherCondition.includes('brume')) {
            this.weatherAlert = "🌫️ Brouillard détecté. Vérifiez l'humidité avant d'arroser.";
          } else if (this.temperature < 20) {
            this.weatherAlert = "❄️ Température froide détectée ! L'arrosage doit etre désactivé pour éviter les dommages aux racines.";
          } else if (this.weatherCondition.includes('dégagé') && this.temperature > 29) {
            this.weatherAlert = "☀️ Forte chaleur détectée, augmentation de l'arrosage recommandée.";
          } else if (this.weatherCondition.includes('nuageux')) {
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
    console.log('Mise à jour des métriques:', { waterLevel: this.waterLevel, humidity_sensor: this.humidity_sensor, ph: this.ph, temperature_sensor: this.temperature_sensor });

    this.metrics = [
      { icon: '🌊', title: 'Volume Eau', value: this.waterLevel !== null ? `${this.waterLevel} L` : '0', unit: 'Litre (L)' },
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
