import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { InscriptionModalComponent } from '../../pages/inscription-modal/inscription-modal.component';
import { ModificationModalComponent } from '../../pages/modification-modal/modification-modal.component';
import { SuppressionModalComponent } from '../../pages/suppression-modal/suppression-modal.component';
import { BlocageModalComponent } from '../../pages/blocage-modal/blocage-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone:true,
  imports: [CommonModule,FormsModule, InscriptionModalComponent, ModificationModalComponent, SuppressionModalComponent, BlocageModalComponent],
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  isModalOpen = false;
  isModalMOpen = false;
  isModalSOpen = false;
  isModalBOpen = false;
  users = [
    { name: 'Olivia Rhye', cardId: '---', email: 'olivia@untitled.com', assignation: 'assigner une carte', selected: false },
    { name: 'Phoenix Baker', cardId: '045678', email: 'phoenix@untitled.com', assignation: 'désassigner la carte', selected: false },
    { name: 'Lana Steiner', cardId: '069437', email: 'lana@untitled.com', assignation: 'assigner une carte', selected: false },
  ];
  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.users.forEach(user => user.selected = checked);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openModalM() {
    this.isModalMOpen = true;
  }

  closeModalM() {
    this.isModalMOpen = false;
  }
  openModalS() {
    this.isModalSOpen = true;
  }

  closeModalS() {
    this.isModalSOpen = false;
  }

  onConfirmDelete() {
    // Logique pour la suppression ou autres actions
    console.log('Suppression confirmée');
    this.closeModalS();
  }

  openModalB() {
    this.isModalBOpen = true;
  }

  closeModalB() {
    this.isModalBOpen = false;
  }

  onConfirmBloq() {
    // Logique pour la suppression ou autres actions
    console.log('Blocage confirmée');
    this.closeModalS();
  }
}
