import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto'; // Importation de Chart.js

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.createChart1(); // Créer le premier graphique
    this.createChart2(); // Créer le deuxième graphique
  }
    // États des sliders
    isWateringOn = false;
    isLightOn = false;

    // Méthode pour basculer l'état du slider
    toggleSlider(slider: 'watering' | 'light') {
      if (slider === 'watering') {
        this.isWateringOn = !this.isWateringOn;
      } else if (slider === 'light') {
        this.isLightOn = !this.isLightOn;
      }
    }
  createChart1(): void {
    const ctx = document.getElementById('chart1') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Ventes Mensuelles',
          data: [65, 59, 80, 81, 56, 55],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mois'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Ventes'
            }
          }
        }
      }
    });
  }

  createChart2(): void {
    const ctx = document.getElementById('chart2') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2021', '2022', '2023'],
        datasets: [{
          label: 'Ventes Annuelles',
          data: [1200, 1500, 1800],
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Année'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Ventes'
            }
          }
        }
      }
    });
  }
}
