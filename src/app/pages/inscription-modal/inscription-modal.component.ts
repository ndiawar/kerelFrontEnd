import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/UserServices';
import Swal from 'sweetalert2';


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
          this.closeModal(); // Fermer le modal après la soumission
          Swal.fire({
            title: 'Utilisateur créé avec succès!',
            text: `Code utilisateur: ${response.code}`, // Assuming the response contains a 'code' field
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.closeModal(); // Fermer le modal après la soumission
          });
        }
      ).catch(
        error => {
          console.error('Erreur lors de la soumission du formulaire:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la soumission du formulaire.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
}
