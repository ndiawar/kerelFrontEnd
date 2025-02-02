import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, } from '@angular/forms';


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

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    alert('Formulaire soumis avec succès!');
    this.closeModal(); // Fermer le modal après la soumission
  }
}
