import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type PlantType = 'tropicales' | 'maraicheres' | 'legumineuses' | 'cereales';
export interface Plant {
  type?: PlantType;
  morning?: string;
  evening?: string;
  water?: number;
  date?: string; // Date peut être facultatif au départ, mais sera initialisé
}

@Component({
  selector: 'app-arrosage',
  standalone: true,
  imports: [CommonModule, FormsModule], // NgxPaginationModule ici  
  templateUrl: './arrosage.component.html',
  styleUrls: ['./arrosage.component.css']
})
export class ArrosageComponent {

    // Get the current date in the format 'YYYY-MM-DD'
  today: string = new Date().toISOString().split('T')[0]; // Initialisation de la date d'aujourd'hui

  // Déclaration de newPlant avec un type Plant
  newPlant: Plant = {
    date: this.today, // Assignation de la date d'aujourd'hui
  };

  plants: { type: PlantType; morning?: string; evening?: string; water: number }[] = [
    { type: 'tropicales', morning: '08:00', evening: '17:00', water: 45 },
    { type: 'maraicheres', morning: '08:00', water: 15 },
    { type: 'legumineuses', morning: '08:00', evening: '17:00', water: 20 },
    { type: 'cereales', morning: '08:00', evening: '17:00', water: 30 }
  ];

  // Pagination
  page: number = 1;
  pageSize: number = 2;

    // Méthode pour récupérer les plantes paginées
    get paginatedPlants() {
      const start = (this.page - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.plants.slice(start, end);
    }

  humidityMap: { [key in PlantType]: number } = {
    tropicales: 70,
    maraicheres: 60,
    legumineuses: 60,
    cereales: 80
  };

  getHumidity(type: PlantType): number {
    return this.humidityMap[type];
  }

  addPlant() {
    if (this.newPlant.type && this.newPlant.water !== undefined) {
      this.plants.push({ type: this.newPlant.type!, morning: this.newPlant.morning, evening: this.newPlant.evening, water: this.newPlant.water! });
      this.newPlant = {};
    }
  }

  capitalize(input: string): string {
    return input ? input.charAt(0).toUpperCase() + input.slice(1) : '';
  }
}
