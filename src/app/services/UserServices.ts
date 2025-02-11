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
        // Vérification si `localStorage` est disponible avant de l'utiliser
        'Authorization': `Bearer ${this.getTokenFromLocalStorage()}`
      }
    });
  }

  async getAllUtilisateurs(): Promise<any> {
    const response = await this.axiosInstance.get('/utilisateurs');
    return response.data;
  }

  async getHistoric(): Promise<any> {
    const response = await this.axiosInstance.get('/historique');
    return response.data;
  }

  async getUserConnected(): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await this.axiosInstance.get('/user/conected', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }

  private getTokenFromLocalStorage(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null; // Retourne null si localStorage n'est pas disponible
  }

  async getUtilisateurById(id: number): Promise<any> {
    const response = await this.axiosInstance.get(`/utilisateurs/${id}`);
    return response.data;
  }

  async createUtilisateur(data: any): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await this.axiosInstance.post('/utilisateurs', data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }

  async updateUtilisateur(id: number, data: any): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await this.axiosInstance.put(`/utilisateurs/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }

  async deleteUtilisateur(id: number): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await this.axiosInstance.delete(`/utilisateurs/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
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
    const token = localStorage.getItem('token');
    const response = await this.axiosInstance.put(`/utilisateurs/bloquer/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }

  async debloquerUtilisateur(id: number): Promise<any> {
    const token = localStorage.getItem('token');
    const response = await this.axiosInstance.put(`/utilisateurs/debloquer/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
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

  // Fonction pour récupérer les données utilisateur depuis le localStorage
  // getUser(): string | null {
  //   return localStorage.getItem('user');
  // }

  

async loginByCard(rfid_code: string): Promise<any> {
  const response = await this.axiosInstance.post('/utilisateurs/loginByCard', { rfid_code });
  const token = response.data.token;
  localStorage.setItem('token', token); // Store the token in localStorage
  this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`; // Update the axios instance with the new token
  return response.data;
}

async assignRfidCode(id: number, rfid_code: string): Promise<any> {
  const token = localStorage.getItem('token');
  const response = await this.axiosInstance.put(`/utilisateurs/assign/${id}`, { rfid_code }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

async unassignRfidCode(id: number): Promise<any> {
  const token = localStorage.getItem('token');
  const response = await this.axiosInstance.put(`/utilisateurs/desassign/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}

}
