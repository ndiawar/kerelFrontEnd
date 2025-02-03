import { Injectable } from '@angular/core';
import axios from 'axios';  // Importation d'Axios

@Injectable({
  providedIn: 'root',
})
export class MeteoService {
  private apiKey = '36b2cae3f500bf74d98baf5ab072ef9f'; // Remplace avec ta clé OpenWeatherMap
  private apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Dakar,Senegal&appid=${this.apiKey}&units=metric&lang=fr`;


  constructor() {}

  getWeather(): Promise<any> {
    return axios.get(this.apiUrl)  // Utilisation d'Axios pour effectuer la requête
      .then(response => response.data)
      .catch(error => {
        console.error('Erreur lors de la récupération de la météo', error);
        throw error;
      });
  }
}
