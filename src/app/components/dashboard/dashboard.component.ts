import { OnInit, OnDestroy, Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MeteoService } from '../../services/meteo.service';
import { LogAccordionComponent } from '../log-accordion/log-accordion.component';
import { GraphsComponent } from '../graphs/graphs.component';
import { SensorService } from '../../services/sensor.service'; // Utilisation du service capteur
import { PumpeService } from '../../services/pompe.service';
import { interval, Subscription, from, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

// Définition d'une interface pour les données météo
interface WeatherData {
  list: Array<{
    main: {
      temp: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
    };
  }>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LogAccordionComponent,
    GraphsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentDate: Date = new Date();
  private timer: any;
  private userLocale: string = 'fr-FR';
  private sensorSubscription: Subscription | null = null;

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

  temperature_sensor: number | null = null;
  ph: number | null = null;
  humidity_sensor: number | null = null;
  waterVolume: number | null = null;

  pumpOn = false;
  pumpState = 'Éteinte';
  errorMessage: string | null = null;

  constructor(
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object,
    private meteoService: MeteoService,
    private sensorService: SensorService, // Injection du service capteur
    private pumpeService: PumpeService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Mise à jour de l'heure en temps réel
      this.timer = setInterval(() => {
        this.currentDate = new Date();
      }, 1000);

      // Récupération de la météo
      this.getWeather();

      // Récupération des données capteurs toutes les 5 secondes
      this.sensorSubscription = interval(5000).subscribe(() => {
        this.getSensorData();
      });
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.sensorSubscription) {
      this.sensorSubscription.unsubscribe();
    }
  }

  private getWeather(): void {
    from(this.meteoService.getWeather()).pipe(  // Convertir la promesse en observable
      timeout(5000),  // Timeout de 5 secondes
      catchError(err => {
        console.error('Erreur lors de la récupération de la météo', err);
        this.weatherAlert = "⚠️ Problème de connexion avec les données météo.";
        return throwError(err);
      })
    ).subscribe((data: WeatherData) => {  // Utilisation du type WeatherData pour 'data'
      if (data && data.list && data.list.length > 0) {
        const currentWeather = data.list[0];

        this.temperature = currentWeather.main.temp;
        this.weatherCondition = currentWeather.weather[0]?.description || '';
        this.weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0]?.icon}.png`;
        this.humidity = currentWeather.main.humidity;
        this.cloudiness = currentWeather.clouds.all;
        this.windSpeed = currentWeather.wind.speed;
        this.pressure = currentWeather.main.pressure;

        this.setWeatherAlert();
      } else {
        console.error('Données météo invalides ou vides', data);
      }
    });
  }

  private setWeatherAlert(): void {
    if (this.weatherCondition.includes('pluie')) {
      this.weatherAlert = "🌧️ Il risque de pleuvoir, l'arrosage automatique doit être désactivé.";
    } else if (this.weatherCondition.includes('orage')) {
      this.weatherAlert = "⛈️ Attention aux orages, arrosage désactivé.";
    } else if (this.windSpeed > 40) {
      this.weatherAlert = "💨 Vent fort détecté ! Arrosage doit être réduit pour éviter l'évaporation.";
    } else if (this.weatherCondition.includes('brouillard') || this.weatherCondition.includes('brume')) {
      this.weatherAlert = "🌫️ Brouillard détecté. Vérifiez l'humidité avant d'arroser.";
    } else if (this.temperature < 20) {
      this.weatherAlert = "❄️ Température froide détectée ! L'arrosage doit être désactivé pour éviter les dommages aux racines.";
    } else if (this.weatherCondition.includes('dégagé') && this.temperature > 29) {
      this.weatherAlert = "☀️ Forte chaleur détectée, augmentation de l'arrosage recommandée.";
    } else if (this.weatherCondition.includes('nuageux')) {
      this.weatherAlert = "☁️ Temps nuageux, surveillez l'humidité.";
    } else {
      this.weatherAlert = "✅ Météo favorable, arrosage normal.";
    }
  }

  private getSensorData(): void {
    this.sensorService.getSensorData().subscribe(
      (data) => {
        this.temperature_sensor = data.temperature || null;
        this.ph = data.ph || null;
        this.humidity_sensor = data.humidity || null;
        this.waterVolume = data.waterLevel || null;

        this.updateMetrics();
      },
      (error) => {
        console.error('Erreur lors de la récupération des données des capteurs', error);
      }
    );
  }

  private updateMetrics() {
    this.metrics = [
      { icon: '🌊', title: 'Volume Eau', value: this.waterVolume !== null ? `${this.waterVolume} L` : '...', unit: 'Litre (L)' },
      { icon: '💧', title: 'Humidité', value: this.humidity_sensor !== null ? `${this.humidity_sensor} %` : '...', unit: '%HR' },
      { icon: '🌱', title: 'pH du sol', value: this.ph !== null ? `${this.ph}` : '...', unit: 'Agriculture' },
      { icon: '🌡️', title: 'Temp.', value: this.temperature_sensor !== null ? `${this.temperature_sensor}°C` : '...', unit: 'Celsius (°C)' }
    ];
  }

  togglePump() {
    const action = this.pumpOn ? 'on' : 'off';
    this.pumpeService.togglePump(action).subscribe({
      next: response => {
        this.pumpState = response.message;
        this.errorMessage = null;
      },
      error: err => {
        this.errorMessage = err;
      }
    });
  }

  get formattedTime(): string {
    return this.datePipe.transform(this.currentDate, 'HH:mm', this.userLocale) || '';
  }

  get formattedDay(): string {
    return this.datePipe.transform(this.currentDate, 'EEEE', this.userLocale) || '';
  }

  get formattedDate(): string {
    return this.datePipe.transform(this.currentDate, 'd MMMM y', this.userLocale) || '';
  }
}
