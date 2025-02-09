import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private subject = new Subject<any>();

  connect(url: string): Observable<any> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => console.log('WebSocket connecté');
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.subject.next(data);
      };
      this.socket.onerror = (error) => console.error('WebSocket erreur', error);
      this.socket.onclose = () => console.log('WebSocket fermé');
    }

    return this.subject.asObservable();
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
