import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  private apiUrl = 'http://192.168.1.20:5000/sensor'; // URL de ton API Flask

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les données
  getSensorData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Fonction qui récupère les données toutes les 5 secondes
  getRealTimeSensorData(): Observable<any> {
    return interval(5000).pipe(switchMap(() => this.getSensorData()));
  }
}
