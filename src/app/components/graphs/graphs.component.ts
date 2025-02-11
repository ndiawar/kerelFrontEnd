import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SensorService } from '../../services/sensor.service';

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

  private isBrowser: boolean;
  private temperatureChart!: Chart;
  private humidityChart!: Chart;
  private temperatureData: number[] = [];
  private humidityData: number[] = [];
  private labels: string[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sensorService: SensorService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      setInterval(() => {
        this.sensorService.getSensorData().subscribe(data => {
          this.updateCharts(data);
        });
      }, 5000); // Rafraîchissement toutes les 5 secondes
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
            ticks: { autoSkip: true, maxTicksLimit: 10 },
            title: { display: true, text: 'Temps' },
          },
          y: { beginAtZero: true },
        },
        plugins: { legend: { display: true } },
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
            ticks: { autoSkip: true, maxTicksLimit: 10 },
            title: { display: true, text: 'Temps' },
          },
          y: { beginAtZero: true },
        },
        plugins: { legend: { display: true } },
      }
    });
  }

  updateCharts(data: any): void {
    if (data.temperature !== undefined) {
      this.temperatureData.push(data.temperature);
      this.labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      this.temperatureChart.update();
    }

    if (data.humidity !== undefined) {
      this.humidityData.push(data.humidity);
      this.labels.push(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      this.humidityChart.update();
    }
  }
}
