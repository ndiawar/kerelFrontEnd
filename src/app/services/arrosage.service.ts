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

    // Vérifier si la date est antérieure à la date actuelle
    const today = new Date().toISOString().split('T')[0]; // Date au format YYYY-MM-DD
    if (date < today) {
      throw new Error('La date choisie est antérieure à aujourd\'hui.'); // Lancer une erreur
    }

    const payload = {
      date,
      typePlante: dataWithoutDate.type,
      heureMatin: dataWithoutDate.morning,
      heureSoir: dataWithoutDate.evening,
      quantiteEau: dataWithoutDate.water
    };

    console.log('Données envoyées à l\'API :', payload);

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
      return response.data.map((arrosage: any) => ({
        id: arrosage._id, // Assurez-vous d'inclure l'ID
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

  // Nouvelle méthode pour supprimer une programmation d'arrosage
  async supprimerArrosage(arrosage: any) {
    try {
      await axios.delete(`${this.apiUrl}/${arrosage.id}`); // Assurez-vous que l'ID est correct
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'arrosage :', error);
      throw error;
    }
  }

  // Nouvelle méthode pour mettre à jour une programmation d'arrosage
 // Nouvelle méthode pour mettre à jour une programmation d'arrosage
// Nouvelle méthode pour mettre à jour une programmation d'arrosage
async updateArrosage(arrosage: any) {
  // Vérifier si la date est antérieure à la date actuelle
  const today = new Date().toISOString().split('T')[0]; // Date au format YYYY-MM-DD
  if (arrosage.date < today) {
    throw new Error('La date choisie est antérieure à aujourd\'hui.'); // Lancer une erreur
  }

  // Définir le type pour le payload
  const payload: { [key: string]: any } = {
    typePlante: arrosage.type,
    heureMatin: arrosage.morning,
    heureSoir: arrosage.evening,
    quantiteEau: arrosage.water
  };

  // Supprimez les propriétés undefined
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  try {
    const response = await axios.put(`${this.apiUrl}/${arrosage.id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'arrosage :', error);
    throw error;
  }
}
}
