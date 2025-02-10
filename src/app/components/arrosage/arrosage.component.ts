import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArrosageService } from '../../services/arrosage.service';

type PlantType = 'tropicales' | 'maraicheres' | 'legumineuses' | 'cereales';

export interface Plant {
  id?: string; // Ajoutez cette ligne
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
  errorMessage: string = ''; // Propriété pour le message d'erreur

  constructor(private arrosageService: ArrosageService) {}

  async ngOnInit() {
    await this.loadArrosages(); // Charger les arrosages lors de l'initialisation
  }

  async loadArrosages() {
    try {
      this.plants = await this.arrosageService.getAllArrosages();
      console.log('Données chargées :', this.plants);
    } catch (error) {
      console.error('Erreur lors du chargement des arrosages', error);
    }
  }async submitPlant() {
    const { date, ...dataWithoutDate } = this.newPlant;

    try {
      if (this.newPlant.id) { // Si l'ID existe, c'est une mise à jour
        const response = await this.arrosageService.updateArrosage(this.newPlant);
        this.plants = this.plants.map(p => p.id === response.arrosage._id ? response.arrosage : p);
      } else { // Sinon, c'est un ajout
        const response = await this.arrosageService.ajouterArrosage(this.newPlant);
        this.plants.push(response);
      }

      this.newPlant = { date: this.today }; // Réinitialiser newPlant
      this.errorMessage = ''; // Réinitialiser le message d'erreur
    } catch (error: any) { // Spécifier le type d'erreur
      this.errorMessage = error.message; // Afficher l'erreur à l'utilisateur
      console.error('Erreur lors de l’ajout ou de la mise à jour de la plante', error);
    }
  }


  async addPlant() {
    const { date, ...dataWithoutDate } = this.newPlant;

    if (this.validateHours()) {
      if (dataWithoutDate.type && dataWithoutDate.water !== undefined) {
        try {
          const response = await this.arrosageService.ajouterArrosage(this.newPlant);
          this.plants.push(response);
          this.newPlant = { date: this.today };
          this.errorMessage = ''; // Réinitialiser le message d'erreur
        } catch (error: any) { // Spécifier le type d'erreur
          this.errorMessage = error.message; // Afficher l'erreur à l'utilisateur
          console.error('Erreur lors de l’ajout de la plante', error);
        }
      }
    } else {
      this.errorMessage = 'Erreur sur la configuration de l\'heure, veuillez réessayer.';
    }
  }
  validateHours(): boolean {
    if (this.newPlant.morning && this.newPlant.evening) {
      const morningHour = this.newPlant.morning;
      const eveningHour = this.newPlant.evening;

      const isValidMorningEvening = morningHour < eveningHour;
      const isValidMorning = !(this.isBetween(morningHour, '15:00', '03:00'));
      const isValidEvening = !(this.isBetween(eveningHour, '03:00', '15:00'));

      return isValidMorningEvening && isValidMorning && isValidEvening;
    }
    return false;
  }

  get totalPages(): number {
    return Math.ceil(this.plants.length / this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  isBetween(hour: string, start: string, end: string): boolean {
    if (start < end) {
      return hour >= start && hour <= end;
    } else {
      return hour >= start || hour <= end;
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
    return this.humidityMap[type] || 0;
  }

  capitalize(input: string): string {
    return input ? input.charAt(0).toUpperCase() + input.slice(1) : '';
  }

  onTypeChange(selectedType: PlantType) {
    console.log('Type de plante sélectionné:', selectedType);
    this.newPlant.type = selectedType;
  }

  // Nouvelle méthode pour éditer une plante
 // Modifier la méthode editPlant pour permettre la mise à jour
 async editPlant(plant: Plant) {
  this.newPlant = { ...plant }; // Remplir newPlant avec les données de la plante sélectionnée

  try {
    const updatedPlant = await this.arrosageService.updateArrosage(this.newPlant);
    this.plants = this.plants.map(p => p.id === updatedPlant.arrosage._id ? updatedPlant.arrosage : p);
  } catch (error: any) { // Spécifier le type d'erreur
    console.error('Erreur lors de la mise à jour de la plante', error);
  }
}


  // Nouvelle méthode pour supprimer une plante

  async deletePlant(plant: Plant) {
    try {
      await this.arrosageService.supprimerArrosage(plant); // Suppression via le service
      this.plants = this.plants.filter(p => p !== plant); // Retirer la plante de la liste
    } catch (error: any) { // Spécifier le type d'erreur
      console.error('Erreur lors de la suppression de la plante', error);
    }
  }
}
