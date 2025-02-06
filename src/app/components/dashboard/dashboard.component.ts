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

  // Définition des cartes avec leurs informations dynamiques
  metrics = [
    { icon: '🌊', title: 'Volume Eau', value: '7.90 L', unit: 'Litre (L)' },
    { icon: '💧', title: 'Humidité', value: '85 %', unit: '%HR' },
    { icon: '🌱', title: 'pH du sol', value: '4 0/14', unit: 'Agriculture' },
    { icon: '🌡️', title: 'Temp.', value: '25°C', unit: 'Celsius (°C)' }
  ];

  constructor(
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Vérifie si la plateforme est un navigateur
    if (isPlatformBrowser(this.platformId)) {
      this.detectUserLocation();
      this.timer = setInterval(() => {
        this.currentDate = new Date();
      }, 1000);
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // Détecte la position géographique et définit la locale
  private detectUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setLocaleBasedOnPosition(position);
      });
    }
  }

  private setLocaleBasedOnPosition(position: GeolocationPosition): void {
    const country = position.coords.latitude > 45 ? 'fr-FR' : 'en-US';
    this.userLocale = country;
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

