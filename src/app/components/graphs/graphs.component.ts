import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { WebSocketService } from '../../services/websocket.service'; // Assurez-vous que le chemin est correct

Chart.register(...registerables);

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css'],
  standalone: true,
})
export class GraphsComponent implements OnInit, AfterViewInit {
  @ViewChild('dailyTemperatureChart') dailyTemperatureChart!: ElementRef;
  @ViewChild('annualHumidityChart') annualHumidityChart!: ElementRef;

  private isBrowser: boolean = false;
  private temperatureChart!: Chart;
  private humidityChart!: Chart;
  private temperatureData: number[] = [];
  private humidityData: number[] = [];
  private labels: string[] = []; // Pour stocker les labels

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private webSocketService: WebSocketService // Injecter le service WebSocket
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.webSocketService.connect('ws://localhost:8080').subscribe(data => {
        this.updateCharts(data);
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.createDailyTemperatureChart();
      this.createAnnualHumidityChart();
    }
  }

  createDailyTemperatureChart(): void {
    this.temperatureChart = new Chart(this.dailyTemperatureChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Température (°C)',
          data: this.temperatureData,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10, // Limiter le nombre de labels affichés
            },
            title: {
              display: true,
              text: 'Temps', // Titre de l'axe des abscisses
            },
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      }
    });
  }

  createAnnualHumidityChart(): void {
    this.humidityChart = new Chart(this.annualHumidityChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'Humidité (%)',
          data: this.humidityData,
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: false,
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10, // Limiter le nombre de labels affichés
            },
            title: {
              display: true,
              text: 'Temps', // Titre de l'axe des abscisses
            },
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      }
    });
  }

  updateCharts(data: any): void {
    // Ajouter les nouvelles données
    if (data.temperature !== null) {
      this.temperatureData.push(data.temperature);
      this.labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Format plus lisible
      this.temperatureChart.update();
    }

    if (data.humidity !== null) {
      this.humidityData.push(data.humidity);
      this.labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Format plus lisible
      this.humidityChart.update();
    }
  }
}
