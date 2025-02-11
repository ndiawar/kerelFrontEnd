import { NgIf } from "@angular/common";
import { UserService } from "../../services/UserServices";
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-suppression-modal',
  standalone: true,
  imports: [  ],
  templateUrl: './suppression-modal.component.html',
  styleUrl: './suppression-modal.component.css'
})
export class SuppressionModalComponent {

  @Input() userId: number | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  showModal: boolean = false;

  constructor(private userService: UserService) {}



  onConfirm() {
    // this.confirm.emit();
    if (this.userId !== null) {
      console.log('Suppression de l\'utilisateur:', this.userId);
      this.userService.deleteUtilisateur(this.userId).then(
        (response) => {
          console.log('Utilisateur supprimé avec succès:', response);
          this.cancel.emit();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        }
      );

  }
}

open() {
  this.showModal = true;
}

close() {
  this.showModal = false;
}

  onCancel() {
    this.cancel.emit();
    this.showModal = false;
  }
}
