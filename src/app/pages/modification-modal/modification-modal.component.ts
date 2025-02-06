import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
export class ModificationModalComponent {
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    alert('Modification effectué avec succès!');
    this.closeModal(); // Fermer le modal après la soumission
  }
}
