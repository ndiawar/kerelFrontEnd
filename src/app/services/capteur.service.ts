import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios'; // Importer Axios
import { Observable, interval, from } from 'rxjs'; // Remplacer switchMap par from
import { switchMap } from 'rxjs'; // Ajouter l'import de switchMap

@Injectable({
  providedIn: 'root',
})
export class CapteurService {
  private apiUrl = 'http://192.168.1.20:5000/sensor'; // URL de ton API Flask
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create(); // Créer une instance d'Axios
  }

  // Fonction pour récupérer les données
  getSensorData(): Observable<any> {
    return from(this.axiosInstance.get(this.apiUrl)); // Utiliser axios pour la requête GET
  }

  // Fonction qui récupère les données toutes les 5 secondes
  getRealTimeSensorData(): Observable<any> {
    return interval(5000).pipe(switchMap(() => this.getSensorData())); // Utiliser la fonction getSensorData
  }
}
