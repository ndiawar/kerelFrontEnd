import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { NgxPaginationModule } from 'ngx-pagination';

import { UserService } from '../../services/UserServices';
import { AssignCardComponent } from '../../pages/assign-card/assign-card.component';
import { InscriptionModalComponent } from '../../pages/inscription-modal/inscription-modal.component';
import { ModificationModalComponent } from '../../pages/modification-modal/modification-modal.component';
import { SuppressionModalComponent } from '../../pages/suppression-modal/suppression-modal.component';
import { BlocageModalComponent } from '../../pages/blocage-modal/blocage-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone:true,
  imports: [CommonModule,FormsModule, InscriptionModalComponent, ModificationModalComponent, SuppressionModalComponent, BlocageModalComponent, AssignCardComponent, NgxPaginationModule],
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit{
  @ViewChild(BlocageModalComponent) blocageModal!: BlocageModalComponent;
  
  isModalOpen = false;
  isModalMOpen = false;
  isModalSOpen = false;
  isModalBOpen = false;
  isModalAOpen = false;
  isModalUnassignOpen = false;
  users: any[] = [];
  selectedUserId: number | null = null;
  filteredUsers: any[] = [];
  searchQuery = '';
  currentPage = 1;  // Page actuelle
  itemsPerPage = 8; // Nombre d'éléments par page
  selectAllChecked = false;

  

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUtilisateurs().then(
      (response) => {
        this.users = response.map((user: any) => ({
          id: user.id,
          name: `${user.prenom} ${user.nom}`,
          cardId: user.rfid_code || '---',
          email: user.email || '---',
          status: user.status,
          assignation: user.rfid_code ? 'désassigner la carte' : 'assigner une carte',
          selected: false,
        }));

        this.filteredUsers = [...this.users];
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    );
  }



  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.selectAllChecked = checked;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const currentPageUsers = this.filteredUsers.slice(startIndex, endIndex);
    currentPageUsers.forEach((user) => (user.selected = checked));
  }

  updateSelectAllState(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const currentPageUsers = this.filteredUsers.slice(startIndex, endIndex);
    this.selectAllChecked = currentPageUsers.every((user) => user.selected);
  }

  openModalUnassign(userId: number): void {
    this.selectedUserId = userId;
    this.isModalUnassignOpen = true;
  }

  closeModalUnassign(): void {
    this.isModalUnassignOpen = false;
    this.selectedUserId = null;
  }

  handleAssignButtonClick(userId: number, assignation: string): void {
    if (assignation === 'assigner une carte') {
      this.openModalA(userId);
    } else {
      this.openModalUnassign(userId);
    }
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  hasSelectedUsers(): boolean {
    return this.users.some(user => user.selected);
  }

  updateSelectionState() {
    this.hasSelectedUsers();
  }

  // Supprimer les utilisateurs sélectionnés
  deleteSelectedUsers() {
    const selectedUsers = this.users.filter(user => user.selected);
    const deletePromises = selectedUsers.map(user => this.userService.deleteUtilisateur(user.id));

    Promise.all(deletePromises).then(() => {
      this.users = this.users.filter(user => !user.selected);
      this.filteredUsers = [...this.users];
      this.selectAllChecked = false;
    }).catch(error => {
      console.error('Erreur lors de la suppression des utilisateurs:', error);
    });
  }

  filterUsers() {
    console.log('🔍 Recherche en cours:', this.searchQuery); // Debug
    console.log('📋 Liste avant filtrage:', this.users); // Debug
  
    const query = this.searchQuery.toLowerCase().trim();
    if (query === '') {
      this.filteredUsers = [...this.users]; // Réinitialisation si champ vide
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.cardId.toLowerCase().includes(query) || // Ajout .toLowerCase()
        user.email.toLowerCase().includes(query)
      );
    }
  
    console.log('📋 Liste après filtrage:', this.filteredUsers); // Debug
  }

  openModalM(userId: number): void {
    this.selectedUserId = userId;
    this.isModalMOpen = true;
  }

  closeModalM(): void {
    this.isModalMOpen = false;
    this.selectedUserId = null;
  }

  openModalS(userId: number): void {
    this.selectedUserId = userId;
    this.isModalSOpen = true;
  }

  closeModalS(): void {
    this.isModalSOpen = false;
    this.selectedUserId = null;
  }

  openModalB(userId: number): void {
    this.selectedUserId = userId;
    this.isModalBOpen = true;
    this.blocageModal.open();
  }

  closeModalB(): void {
    this.isModalBOpen = false;
    this.selectedUserId = null;
  }

  openModalA(userId: number): void {
    this.selectedUserId = userId;
    this.isModalAOpen = true;
  }

  closeModalA(): void {
    this.isModalAOpen = false;
    this.selectedUserId = null;
  }

  onConfirmDelete() {
    // Logique pour la suppression ou autres actions
    console.log('Suppression confirmée');
    this.closeModalS();
  }

  onConfirmBloq() {
    // Logique pour la suppression ou autres actions
    console.log('Blocage confirmée');
    this.closeModalS();
  }
}
