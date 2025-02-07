import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import { UserService } from '../../services/UserServices';
import { AssignCardComponent } from '../../assign-card/assign-card.component';
import { InscriptionModalComponent } from '../../pages/inscription-modal/inscription-modal.component';
import { ModificationModalComponent } from '../../pages/modification-modal/modification-modal.component';
import { SuppressionModalComponent } from '../../pages/suppression-modal/suppression-modal.component';
import { BlocageModalComponent } from '../../pages/blocage-modal/blocage-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone:true,
  imports: [CommonModule,FormsModule, InscriptionModalComponent, ModificationModalComponent, SuppressionModalComponent, BlocageModalComponent, AssignCardComponent],
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit{
  isModalOpen = false;
  isModalMOpen = false;
  isModalSOpen = false;
  isModalBOpen = false;
  isModalAOpen = false;
  users: any[] = [];
  selectedUserId: number | null = null;
  

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
          assignation: user.rfid_code ? 'désassigner la carte' : 'assigner une carte',
          selected: false,
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    );
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.users.forEach(user => user.selected = checked);
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
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
