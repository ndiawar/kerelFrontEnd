import { Component, Output, EventEmitter, Input } from '@angular/core';
import { UserService } from '../../services/UserServices';

@Component({
  selector: 'app-desassigner-modal',
  standalone: true,
  imports: [],
  templateUrl: './desassigner-modal.component.html',
  styleUrl: './desassigner-modal.component.css'
})
export class DesassignerModalComponent {

  @Input() isVisible: boolean = false;
  @Input() userId: number | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private userService: UserService) {}

  closeModal(): void {
    this.cancel.emit();
  }

  confirmDesassign(): void {
    if (this.userId !== null) {
      this.userService.unassignRfidCode(this.userId).then(
        (response) => {
          console.log('Unassignment successful:', response);
          this.confirm.emit();
          this.closeModal();
        },
        (error) => {
          console.error('Unassignment failed:', error);
        }
      );
    }
  }

}
