import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/UserServices';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-card',
  standalone: true,
  imports: [],
  templateUrl: './assign-card.component.html',
  styleUrl: './assign-card.component.css'
})
export class AssignCardComponent implements OnInit, OnDestroy{
  
  @Input() userId: number | null = null;
  @Input() isVisible: boolean = false;
  @Output() visibilityChange = new EventEmitter<boolean>(); // Événement pour fermer
  private socket: WebSocket | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    console.log('Id utilisateur:', this.userId);
    this.initializeWebSocket();
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close(); // Fermer la connexion WebSocket lors de la destruction du composant
    }
  }

  initializeWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:3004/');
    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.socket.onmessage = (event) => {
      const cardNumber = event.data;
      this.assignCard(cardNumber);
    };
  }

  assignCard(cardNumber: string): void {
    if (this.userId !== null) {
      
      this.userService.assignRfidCode(this.userId, cardNumber).then(
        (response) => {
          console.log('Carte assignée avec succès:', response);
          Swal.fire({
            title: 'Carte assignée avec succès!',
            text: `Code utilisateur: ${response.user.code}`, // Assuming the response contains a 'user' object with a 'code' field
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.closeModal(); // Fermer le modal après la soumission
          });
        },
        (error) => {
          console.error('Erreur lors de l\'assignation de la carte:', error);
          Swal.fire({
            title: 'Erreur',
            text: error.response.data.message || 'Erreur lors de l\'assignation de la carte.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }

  closeModal() {
    this.isVisible = false;
    this.visibilityChange.emit(this.isVisible);
  }

}
