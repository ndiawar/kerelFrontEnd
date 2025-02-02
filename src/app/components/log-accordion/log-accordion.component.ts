import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule

@Component({
  selector: 'app-log-accordion',
  templateUrl: './log-accordion.component.html',
  styleUrls: ['./log-accordion.component.css'],
  standalone: true,
  imports: [CommonModule], // Ajoutez CommonModule ici
})
export class LogAccordionComponent {
  items = [
    {
      title: 'Yaye Fatou Kane',
      content: 'Inscrit un utilisateur',
      details: ['Ouvert les vannes arrossage', 'Consulter Température'],
      open: false
    },
    {
      title: 'Oumou Khairy Ndiaye',
      content: 'Inscrit un utilisateur',
      details: ['Ouvert les vannes arrossage', 'Consulter Température'],
      open: false
    },
    {
      title: 'Ndiawar Diop',
      content: 'Inscrit un utilisateur',
      details: ['Ouvert les vannes arrossage', 'Consulter Température'],
      open: false
    },
    {
      title: 'Abdoul Rahmane Sow',
      content: 'Inscrit un utilisateur',
      details: ['Ouvert les vannes arrossage', 'Consulter Température'],
      open: false
    },
    // Ajoutez plus d'éléments pour tester la pagination
    {
      title: 'Item 5',
      content: 'Content 5',
      details: ['Detail 5-1', 'Detail 5-2'],
      open: false
    },
    {
      title: 'Item 6',
      content: 'Content 6',
      details: ['Detail 6-1', 'Detail 6-2'],
      open: false
    },
    {
      title: 'Item 7',
      content: 'Content 7',
      details: ['Detail 7-1', 'Detail 7-2'],
      open: false
    },
    {
      title: 'Item 8',
      content: 'Content 8',
      details: ['Detail 8-1', 'Detail 8-2'],
      open: false
    },
  ];

  colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF']; // Tableau de couleurs
  itemsPerPage = 4; // Nombre d'éléments par page
  currentPage = 1; // Page actuelle

  get paginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.items.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleItem(index: number) {
    this.paginatedItems[index].open = !this.paginatedItems[index].open;
  }
}
