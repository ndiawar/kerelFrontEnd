import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-suppression-modal',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './suppression-modal.component.html',
  styleUrl: './suppression-modal.component.css'
})
export class SuppressionModalComponent {

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  showModal: boolean = false;

  // open() {
  //   this.showModal = true;
  // }

  // close() {
  //   this.showModal = false;
  // }

  onConfirm() {
    this.confirm.emit();
    this.showModal = false;
  }

  onCancel() {
    this.cancel.emit();
    this.showModal = false;
  }
}
