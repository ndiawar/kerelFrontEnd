import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment'; // Importation de l'environnement

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // Utilisation de l'URL de l'API à partir de l'environnement
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming the token is stored in localStorage
      }
    });
  }

  async getAllUtilisateurs(params?: any): Promise<any> {
    const response = await this.axiosInstance.get('/utilisateurs', { params });
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
    const response = await this.axiosInstance.post('/utilisateurs/logout');
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
}