// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importation de l'environnement

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl; // Utilisation de l'URL de l'API à partir de l'environnement

  constructor(private http: HttpClient) { }

  // Exemple de méthode pour récupérer les utilisateurs
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`); // Utilisation de l'apiUrl
  }

  // Autres méthodes pour interagir avec l'API (par exemple, créer un utilisateur)
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData); // Utilisation de l'apiUrl
  }
}
