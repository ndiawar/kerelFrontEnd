import { Injectable } from '@angular/core';
import axios from 'axios';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | null = null; // Initialisation à null

  // Méthode pour établir une connexion WebSocket
  connect(url: string): Observable<any> {
    this.socket$ = webSocket(url);
    return this.socket$.asObservable();
  }

  // Méthode pour fermer la connexion WebSocket
  close() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null; // Réinitialiser à null après fermeture
    }
  }

  // Méthode pour envoyer des données via WebSocket
  send(data: any) {
    if (this.socket$) {
      this.socket$.next(data);
    } else {
      console.error('WebSocket non ouvert. Impossible d\'envoyer les données.');
    }
  }

  // Méthode pour effectuer une requête HTTP GET avec axios
  get(url: string, config?: any): Promise<any> {
    return axios.get(url, config);
  }

  // Méthode pour effectuer une requête HTTP POST avec axios
  post(url: string, data?: any, config?: any): Promise<any> {
    return axios.post(url, data, config);
  }

  // Méthode pour effectuer une requête HTTP PUT avec axios
  put(url: string, data?: any, config?: any): Promise<any> {
    return axios.put(url, data, config);
  }

  // Méthode pour effectuer une requête HTTP DELETE avec axios
  delete(url: string, config?: any): Promise<any> {
    return axios.delete(url, config);
  }
}
