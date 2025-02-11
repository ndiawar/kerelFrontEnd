import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/UserServices';

@Component({
  selector: 'app-log-accordion',
  templateUrl: './log-accordion.component.html',
  styleUrls: ['./log-accordion.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LogAccordionComponent implements OnInit {
  items: any[] = [];
  colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF'];
  itemsPerPage = 4;
  currentPage = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getHistorique();
  }

  getHistorique(): void {
    this.userService.getHistoric().then(
      (response) => {
        this.items = response.map((item: any) => ({
          ...item,
          open: false
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'historique:', error);
      }
    );
  }

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

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(date).toLocaleDateString('fr-FR', options);
  }

  formatTime(date: string): string {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleTimeString('fr-FR', options);
  }
}