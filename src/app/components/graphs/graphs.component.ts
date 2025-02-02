import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.createDailyTemperatureChart();
      this.createAnnualHumidityChart();
    }
  }

  createDailyTemperatureChart(): void {
    new Chart(this.dailyTemperatureChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['12h', '13h', '14h', '15h', '16h', '17h', '18h'],
        datasets: [{
          label: 'Température (°C)',
          data: [15, 20, 25, 22, 18, 20, 24],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  createAnnualHumidityChart(): void {
    new Chart(this.annualHumidityChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        datasets: [{
          label: 'Humidité (%)',
          data: [5, 8, 12, 15, 10, 13, 9],
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: false,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }
}
