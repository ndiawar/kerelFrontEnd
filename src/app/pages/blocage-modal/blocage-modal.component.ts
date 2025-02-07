import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from '../../services/UserServices';

@Component({
  selector: 'app-blocage-modal',
  standalone: true,
  imports: [ NgIf],
  templateUrl: './blocage-modal.component.html',
  styleUrl: './blocage-modal.component.css'
})
export class BlocageModalComponent {

    @Input() userId: number | null = null;
   @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
  
    showModal: boolean = false;

    constructor(private userService: UserService) {}
  
    open() {
      this.showModal = true;
    }
  
    close() {
      this.showModal = false;
    }
  
    onConfirm() {


      if (this.userId !== null)
      {
        console.log('Blocage de l\'utilisateur:', this.userId);
      this.userService.bloquerUtilisateur(this.userId).then(
        (response) => {
          console.log('Utilisateur bloqué avec succès:', response);
          this.confirm.emit();
        },
        (error) => {
          console.error('Erreur lors du blocage de l\'utilisateur:', error);
        }
      );}
    }
  
    onCancel() {
      this.cancel.emit();
      this.showModal = false;
      this.showModal = false;
    }
  }

