import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-assign-card',
  standalone: true,
  imports: [],
  templateUrl: './assign-card.component.html',
  styleUrl: './assign-card.component.css'
})
export class AssignCardComponent {
  // @Input() isOpen: boolean = false; // Réception de l'état du modal
  @Output() close = new EventEmitter<void>(); // Événement pour fermer

  closeModal() {
    this.close.emit(); // Informe le parent que le modal doit être fermé
  }

}
