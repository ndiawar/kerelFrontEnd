import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',  // S'assurer que le service est fourni à l'échelle de l'application
})
export class PumpeService {
  private baseUrl = 'http://192.168.1.20:5001/pump';

  constructor(private http: HttpClient) {}

  togglePump(action: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${action}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur : ${error.error.message}`;
    } else {
      errorMessage = `Erreur Code : ${error.status}\nMessage : ${error.error.message}`;
    }
    return throwError(errorMessage);
  }
}

