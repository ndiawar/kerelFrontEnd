import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment'; // Importation de l'environnement
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // Utilisation de l'URL de l'API à partir de l'environnement
  private axiosInstance: AxiosInstance;
  private userData: any = null;
  private socket: WebSocket | null = null; // WebSocket instance
  private socketMessages$ = new Subject<any>();

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming the token is stored in localStorage
      }
    });
  }

  async getAllUtilisateurs(): Promise<any> {
    const response = await this.axiosInstance.get('/utilisateurs');
    return response.data;
  }

  async getUtilisateurById(id: number): Promise<any> {
    const response = await this.axiosInstance.get(`/utilisateurs/${id}`);
    return response.data;
  }

  async createUtilisateur(data: any): Promise<any> {
    const response = await this.axiosInstance.post('/utilisateurs', data);
    return response.data;
  }

  async updateUtilisateur(id: number, data: any): Promise<any> {
    const response = await this.axiosInstance.put(`/utilisateurs/${id}`, data);
    return response.data;
  }

  async deleteUtilisateur(id: number): Promise<any> {
    const response = await this.axiosInstance.delete(`/utilisateurs/${id}`);
    return response.data;
  }

  async loginByCode(code: string): Promise<any> {
    const response = await this.axiosInstance.post('/utilisateurs/login', { code });
    return response.data;
  }

  async logout(): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await this.axiosInstance.post('/utilisateurs/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    localStorage.removeItem('token'); // Remove the token from localStorage
    return response.data;
  }

  async bloquerUtilisateur(id: number): Promise<any> {
    const response = await this.axiosInstance.put('/utilisateurs/bloquer', { id });
    return response.data;
  }

  async debloquerUtilisateur(id: number): Promise<any> {
    const response = await this.axiosInstance.put('/utilisateurs/debloquer', { id });
    return response.data;
  }

  // Fonction pour sauvegarder les données utilisateur dans le localStorage
  setUserData(user: any): void {
    this.userData = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Fonction pour sauvegarder le token dans le localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Fonction pour récupérer le token depuis le localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  initializeWebSocket() {
    this.socket = new WebSocket('ws://localhost:3004');

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.cardID) { // Ajout d'une vérification
          this.socketMessages$.next({ type: 'card', cardID: message.cardID });
      } else if (message.mode) {
          this.socketMessages$.next({ type: 'mode', mode: message.mode });
      }
  };

    this.socket.onerror = (error) => {
        console.error('Erreur WebSocket :', error);
    };

    this.socket.onclose = () => {
        console.warn('WebSocket déconnecté.');
    };
}

async loginByCard(rfid_code: string): Promise<any> {
  const response = await this.axiosInstance.post('/utilisateurs/loginByCard', { rfid_code });
  const token = response.data.token;
  localStorage.setItem('token', token); // Store the token in localStorage
  this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`; // Update the axios instance with the new token
  return response.data;
}

async assignRfidCode(id: number, rfid_code: string): Promise<any> {
  const response = await this.axiosInstance.put(`/utilisateurs/assign/${id}`, { rfid_code });
  return response.data;
}

async unassignRfidCode(id: number): Promise<any> {
  const response = await this.axiosInstance.put(`/utilisateurs/desassign/${id}`);
  return response.data;
}

}