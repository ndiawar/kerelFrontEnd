import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ArrosageService } from '../../services/arrosage.service';

type PlantType = 'tropicales' | 'maraicheres' | 'legumineuses' | 'cereales' | 'autres';

export interface Plant {
  id?: string;
  type?: PlantType;
  morning?: string;
  evening?: string;
  water?: number;
  date?: string;
  otherType?: string;
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
    type: undefined
  };

  plants: Plant[] = [];
  page: number = 1;
  pageSize: number = 2;
  errorMessage: string = '';
  morningError: string = '';
  eveningError: string = '';

  plantTypes: PlantType[] = ['tropicales', 'maraicheres', 'legumineuses', 'cereales', 'autres'];

  constructor(private arrosageService: ArrosageService) {}



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
    cereales: 80,
    autres: 0
  };

  getHumidity(type: PlantType): number {
    return this.humidityMap[type] || 0;
  }

  capitalize(input: string): string {
    return input ? input.charAt(0).toUpperCase() + input.slice(1) : '';
  }


  // onTypeChange(selectedType: PlantType) {
  //   this.newPlant.type = selectedType;
  
  //   // Si "autres" est sélectionné, réinitialiser la valeur de "otherType" à vide.
  //   if (selectedType === 'autres') {
  //     this.newPlant.otherType = '';  // Réinitialisation du champ "autres"
  //   } else {
  //     this.newPlant.otherType = undefined;  // Réinitialiser autre champ si un autre type est sélectionné
  //   }
  // }
  editPlant(plant: Plant) {
    this.newPlant = { ...plant };
  }

  async deletePlant(plant: Plant) {
    try {
      await this.arrosageService.supprimerArrosage(plant);
      this.plants = this.plants.filter(p => p !== plant);
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la plante', error);
    }
  }

  async ngOnInit() {
    await this.loadArrosages();
  }

  async loadArrosages() {
    try {
      this.plants = await this.arrosageService.getAllArrosages();
    } catch (error) {
      console.error('Erreur lors du chargement des arrosages', error);
    }
  }

  validateHours(): boolean {
    const morningHour = this.newPlant.morning || '';
    const eveningHour = this.newPlant.evening || '';

    this.morningError = '';
    this.eveningError = '';

    if (morningHour) {
      if (morningHour >= '15:00') {
        this.morningError = 'L\'heure du matin doit être avant 15h00.';
      }
    }

    if (eveningHour) {
      if (eveningHour < '15:00') {
        this.eveningError = 'L\'heure du soir doit être après 15h00.';
      }
    }

    return !this.morningError && !this.eveningError;
  }

  async submitPlant(form: NgForm) {
    if (form.invalid || !this.validateHours()) {
      return;
    }

    try {
      if (this.newPlant.id) {
        const response = await this.arrosageService.updateArrosage(this.newPlant);
        this.plants = this.plants.map(p => p.id === response.arrosage._id ? response.arrosage : p);
      } else {
        const response = await this.arrosageService.ajouterArrosage(this.newPlant);
        this.plants.push(response);
      }
      this.newPlant = { date: this.today };
      this.errorMessage = '';
    } catch (error: any) {
      this.errorMessage = error.message;
    }
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

  onTypeChange(selectedType: PlantType) {
    this.newPlant.type = selectedType;
    this.newPlant.otherType = selectedType === 'autres' ? '' : undefined;
  }

  getSelectedPlantName(): string {
    return this.newPlant.type === 'autres' ? this.newPlant.otherType || 'Autres (non précisé)' : this.capitalize(this.newPlant.type || '');
  }

}