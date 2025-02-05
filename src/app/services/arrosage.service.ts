import axios from 'axios';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArrosageService {
  private apiUrl = 'http://localhost:3000/api/arrosage'; // Remplace par l’URL de ton backend

  // Ajouter une programmation d'arrosage
  async ajouterArrosage(arrosageData: any) {
    const { date, ...dataWithoutDate } = arrosageData;

    // Renommez les propriétés pour correspondre au modèle
    const payload = {
        typePlante: dataWithoutDate.type,
        heureMatin: dataWithoutDate.morning,
        heureSoir: dataWithoutDate.evening,
        quantiteEau: dataWithoutDate.water
    };

    console.log('Données envoyées à l\'API :', payload); // Vérifiez ici

    try {
        const response = await axios.post(`${this.apiUrl}/`, payload);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'arrosage :', error);
        throw error;
    }
}
  // Récupérer toutes les programmations d’arrosage
  async getAllArrosages() {
    try {
      const response = await axios.get(`${this.apiUrl}/`);
      // Mapper les données pour correspondre au modèle attendu
      return response.data.map((arrosage: any) => ({
        type: arrosage.typePlante,
        morning: arrosage.heureMatin,
        evening: arrosage.heureSoir,
        water: arrosage.quantiteEau
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des arrosages :', error);
      throw error;
    }
  }
}
