import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../../services/UserServices';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [FormsModule,CommonModule, NgxPaginationModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent {
  searchTerm: string = '';
  actions: any[] = [];
  p = 1;
  nbItems: number = 10;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getHistorique();
  }

  getHistorique(): void {
    this.userService.getHistoric().then(
      (response) => {
        this.actions = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'historique:', error);
      }
    );
  }
  get filteredActions() {
    return this.actions.filter(action =>
      action.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      action.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      action.Action.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.formatDate(action.created_at).includes(this.searchTerm)
    );
  }
  
  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(date).toLocaleDateString('fr-FR', options); // Format de date pour la comparaison
  }

  formatTime(date: string): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleTimeString('fr-FR', options); // Format de l'heure pour la comparaison
  }
}
