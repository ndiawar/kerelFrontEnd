import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/UserServices';


@Component({
  selector: 'app-inscription-modal',
  standalone: true,
  imports: [
    FormsModule, 
    NgIf,
  ],
  templateUrl: './inscription-modal.component.html',
  styleUrl: './inscription-modal.component.css'
})
export class InscriptionModalComponent {

  @Output() close = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  closeModal() {
    this.close.emit();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = {
        "nom": form.value.nom,
        "prenom": form.value.prenom,
        "telephone": form.value.telephone,
        "email": form.value.numeroCarte, // Assuming numeroCarte is the email field
        "role": form.value.role
      };

      this.userService.createUtilisateur(formData).then(
        response => {
          console.log('Formulaire soumis avec succès:', response);
          alert('Formulaire soumis avec succès!');
          this.closeModal(); // Fermer le modal après la soumission
        }
      ).catch(
        error => {
          console.error('Erreur lors de la soumission du formulaire:', error);
          alert('Erreur lors de la soumission du formulaire.');
        }
      );
    }
  }
}
