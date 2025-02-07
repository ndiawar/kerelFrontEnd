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
    user: any = {};
  
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
        this.userService.getUtilisateurById(this.userId).then(
          (response) => {
            this.user = response;
            console.log('Utilisateur récupéré avec succès:', this.user);
          },
          (error) => {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          }
        );

      if (this.userId !== null && this.user && this.user.status === 'active')
      {
        console.log('Confirmation de blocage de l\'utilisateur:', this.userId);
        this.userService.bloquerUtilisateur(this.userId).then(
        (response) => {
          console.log('Utilisateur bloqué avec succès:', response);
          this.cancel.emit();
          this.showModal = false;
        },
        (error) => {
          console.error('Erreur lors du blocage de l\'utilisateur:', error);
        }
      );
    } 
    if(this.userId !== null && this.user && this.user.status === 'inactive')
       {
      console.log('Confirmation de déblocage de l\'utilisateur:', this.userId);
      this.userService.debloquerUtilisateur(this.userId).then(
        (response) => {
          console.log('Utilisateur débloqué avec succès:', response);
          this.cancel.emit();
        },
        (error) => {
          console.error('Erreur lors du déblocage de l\'utilisateur:', error);
        }
      );
    }
    }
  }
  
    onCancel() {
      this.cancel.emit();
      this.showModal = false;
      this.showModal = false;
    }
  }

