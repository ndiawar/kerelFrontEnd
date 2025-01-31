import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent {
  searchTerm: string = '';
    actions = [
      { id: 1, name: 'Abou Sow', description: 'a modifié un nouvel utilisateur', time: '9:00', date: new Date('2023-01-10') },
      { id: 2, name: 'Ndiaye Diop', description: 'a bloqué un utilisateur', time: '4:59', date: new Date('2023-01-11') },
      { id: 3, name: 'Oumar Ndiaye', description: 's\'est connecté', time: '1:15', date: new Date('2023-01-12') },
      { id: 4, name: 'Yaye Kane', description: 'a fermé la vanne', time: '7:45', date: new Date('2023-01-13') },
      { id: 5, name: 'Roam Research', description: 's\'est connecté', time: '9:32', date: new Date('2023-01-14') },
      { id: 6, name: 'Ndiaye Diop', description: 's\'est déconnecté', time: '8:15', date: new Date('2023-01-15') },
      { id: 7, name: 'Oumar Ndiaye', description: 's\'est déconnecté', time: '6:21', date: new Date('2023-01-16') },
      { id: 8, name: 'Yaye Kane', description: 's\'est connecté', time: '12:51', date: new Date('2023-01-17') },
    ];
    get filteredActions() {
      return this.actions.filter(action =>
        action.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.formatDate(action.date).includes(this.searchTerm)
      );
    }
  
    formatDate(date: Date): string {
      return date.toLocaleDateString(); // Format de date pour la comparaison
    }
}
