import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/UserServices';

@Component({
  selector: 'app-modification-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './modification-modal.component.html',
  styleUrl: './modification-modal.component.css'
})
export class ModificationModalComponent implements OnInit{

  @Input() userId: number | null = null;

  @Output() close = new EventEmitter<void>();
  user: any = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userId !== null) {
      this.userService.getUtilisateurById(this.userId).then(
        (response) => {
          this.user = response;
        },
        (error) => {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        }
      );
    }
  }

  closeModal() {
    this.close.emit();
  }

  onSubmit(form: NgForm): void {
    if (this.userId !== null) {
      const formData = {
        "nom": form.value.nom,
        "prenom": form.value.prenom,
        "telephone": form.value.telephone,
        "email": form.value.numeroCarte, // Assuming numeroCarte is the email field
        "role": form.value.role
      };
      this.userService.updateUtilisateur(this.userId, formData).then(
        (response) => {
          console.log('Utilisateur mis à jour avec succès:', response);
          this.closeModal();
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        }
      );
    }
  }
}
