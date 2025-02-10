import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/UserServices';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';



@Component({
  selector: 'app-login-kerel-eco',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [],
  templateUrl: './login-kerel-eco.component.html',
  styleUrls: ['./login-kerel-eco.component.css']
})
export class LoginKerelEcoComponent implements OnInit {
  showInputs = false; // Contrôle l'affichage des inputs
  showError = false; // Contrôle l'affichage du message d'erreur
  showError2 = false;
  errorMessage: string = '';

  constructor(private apiService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.listenToWebSocket(); // Écouter les messages WebSocket
  }

  // Références aux inputs
  @ViewChild('input0') input0!: ElementRef<HTMLInputElement>;
  @ViewChild('input1') input1!: ElementRef<HTMLInputElement>;
  @ViewChild('input2') input2!: ElementRef<HTMLInputElement>;
  @ViewChild('input3') input3!: ElementRef<HTMLInputElement>;

  // Écoute l'événement keydown sur tout le document
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.showInputs) {
      this.showInputs = true; // Affiche les inputs dès qu'une touche est pressée
      setTimeout(() => this.input0.nativeElement.focus(), 0); // Focus sur le premier input
    }
  }

  // Écoute les clics en dehors des inputs pour les masquer
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const inputContainer = document.querySelector('.input-container');
    if (inputContainer && !inputContainer.contains(event.target as Node)) {
      this.showInputs = false; // Masque les inputs si on clique en dehors
      this.showError = false; // Masque le message d'erreur
    }
  }

  // Gère le changement de valeur dans les inputs
  onInputChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Vérifie si la valeur saisie est un chiffre
    if (!/^\d*$/.test(value)) {
      input.value = ''; // Efface la valeur si ce n'est pas un chiffre
      return;
    }

    if (value.length === 1) {
      // Affiche temporairement le caractère saisi
      input.type = 'text'; // Affiche le caractère
      setTimeout(() => {
        input.type = 'password'; // Remplace le caractère par une étoile après 200 ms
      }, 200);

      // Passe au champ suivant si un caractère est saisi
      if (index < 3) {
        switch (index) {
          case 0:
            this.input1.nativeElement.focus();
            break;
          case 1:
            this.input2.nativeElement.focus();
            break;
          case 2:
            this.input3.nativeElement.focus();
            break;
        }
      } else {
        // Si le dernier champ est rempli, valider le code
        this.validateCode();
      }

      // Vérifie si l'utilisateur a saisi plus de 4 chiffres
      const totalDigits = [
        this.input0.nativeElement.value,
        this.input1.nativeElement.value,
        this.input2.nativeElement.value,
        this.input3.nativeElement.value
      ].filter(Boolean).length; // Compte le nombre de chiffres saisis

      if (totalDigits > 4) {
        this.showError = true; // Affiche le message d'erreur
      } else {
        this.showError = false; // Masque le message d'erreur
      }
    }
  }

  // Valide le code saisi
  validateCode() {
    const code = [
      this.input0.nativeElement.value,
      this.input1.nativeElement.value,
      this.input2.nativeElement.value,
      this.input3.nativeElement.value
    ].join('');
  
    if (code.length === 4) {
      this.apiService.loginByCode(code).then(
        response => {
          // Supposons que la réponse indique une authentification réussie
          console.log('Login response:', response);
          this.apiService.saveToken(response.token);
          this.apiService.setUserData(response.user);
          if (response) {
            // Redirection vers le tableau de bord
            this.router.navigate(['/dashboard']);
          } else {
            // Gérer le cas où l'authentification échoue
            this.showError2 = true;
            this.clearInputs();
          }
        }
      ).catch(
        error => {
          // Gérer les erreurs de la requête
          console.error('Login failed:', error);
          this.showError2 = true;
          this.clearInputs();
        }
      );
    } else {
      console.log('Veuillez saisir un code à 4 chiffres');
    }
  }
  
  clearInputs() {
    this.input0.nativeElement.value = '';
    this.input1.nativeElement.value = '';
    this.input2.nativeElement.value = '';
    this.input3.nativeElement.value = '';
    this.input0.nativeElement.focus(); // Optionally, set focus back to the first input
  }

  // Définir la fonction scanCard()
  scanCard() {
    console.log('Scannez votre carte');
    // Ajoutez ici la logique pour scanner la carte
  }

  // Définir la fonction enterCode()
  enterCode() {
    console.log('Saisissez votre code secret');
    this.showInputs = true; // Affiche les inputs pour la saisie du code
    setTimeout(() => this.input0.nativeElement.focus(), 0); // Focus sur le premier input
  }

  listenToWebSocket(): void {
    const ws = new WebSocket('ws://localhost:3004');
    ws.onmessage = (event) => {

      if (event.data !== '') 
      {
        const scannedCard = event.data;
      console.log('Carte scannée:', scannedCard);
      this.handleRFIDLogin(scannedCard);
    }
  }}

  private handleRFIDLogin(rfidCardId: string): void {
    this.apiService.loginByCard(rfidCardId).then(
        response => {
          if(response.token !== null){
            this.router.navigate(['/dashboard']);
          }
        
    }).catch(
      error => {
        // Gérer les erreurs de la requête
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed: ' + (error.message || 'Unknown error');
      }
    );;
}
}
