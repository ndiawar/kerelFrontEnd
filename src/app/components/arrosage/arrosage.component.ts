import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArrosageService } from '../../services/arrosage.service';

type PlantType = 'tropicales' | 'maraicheres' | 'legumineuses' | 'cereales';

export interface Plant {
  type?: PlantType;
  morning?: string;
  evening?: string;
  water?: number;
  date?: string;
}

@Component({
  selector: 'app-arrosage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arrosage.component.html',
  styleUrls: ['./arrosage.component.css']
})
export class ArrosageComponent implements OnInit {

  today: string = new Date().toISOString().split('T')[0];
  newPlant: Plant = {
    date: this.today,
    type: undefined // Initialisation de type
  };

  plants: Plant[] = [];
  page: number = 1;
  pageSize: number = 2;

  constructor(private arrosageService: ArrosageService) {}

  async ngOnInit() {
    await this.loadArrosages(); // Charger les arrosages lors de l'initialisation
  }

  // Charger les programmations existantes depuis l’API
  async loadArrosages() {
  try {
    this.plants = await this.arrosageService.getAllArrosages();
    console.log('Données chargées :', this.plants); // Afficher les données dans la console
  } catch (error) {
    console.error('Erreur lors du chargement des arrosages', error);
  }
}

  // Ajouter une nouvelle programmation d’arrosage
  async addPlant() {
    const { date, ...dataWithoutDate } = this.newPlant;

    if (dataWithoutDate.type && dataWithoutDate.water !== undefined) {
      try {
        const response = await this.arrosageService.ajouterArrosage(dataWithoutDate);
        this.plants.push(response); // Ajouter la nouvelle programmation à la liste
        this.newPlant = { date: this.today }; // Réinitialiser newPlant
      } catch (error) {
        console.error('Erreur lors de l’ajout de la plante', error);
      }
    }
  }

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
    return this.humidityMap[type] || 0; // Retourne 0 si le type n'est pas trouvé
  }

  capitalize(input: string): string {
    return input ? input.charAt(0).toUpperCase() + input.slice(1) : '';
  }

  // Méthode pour gérer le changement de type de plante
  onTypeChange(selectedType: PlantType) {
    console.log('Type de plante sélectionné:', selectedType);
    this.newPlant.type = selectedType; // Mettre à jour newPlant.type
  }
}
