import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-blocage-modal',
  standalone: true,
  imports: [],
  templateUrl: './blocage-modal.component.html',
  styleUrl: './blocage-modal.component.css'
})
export class BlocageModalComponent {

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

