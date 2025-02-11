import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { AxiosError } from 'axios';  // Assure-toi d'importer AxiosError

import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ArrosageService {
  private apiUrl = 'http://localhost:3000/api/arrosage';

  private arrosageStatus = new BehaviorSubject<string>('Vérification en cours...');
  arrosageStatus$ = this.arrosageStatus.asObservable();

  private intervalId: any = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Ajouter une programmation d'arrosage
  async ajouterArrosage(arrosageData: any) {
    if (!this.isBrowser) return; // ⚠️ Empêcher les requêtes HTTP côté serveur

    const { date, ...dataWithoutDate } = arrosageData;
    const today = new Date().toISOString().split('T')[0];

    if (date < today) {
      throw new Error("La date choisie est antérieure à aujourd'hui.");
    }

    const payload = {
      date,
      typePlante: dataWithoutDate.type,
      heureMatin: dataWithoutDate.morning,
      heureSoir: dataWithoutDate.evening,
      quantiteEau: dataWithoutDate.water
    };

    try {
      const response = await axios.post(`${this.apiUrl}/`, payload);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'arrosage :", error);
      throw error;
    }
  }

  // Récupérer toutes les programmations d’arrosage
  async getAllArrosages() {
    if (!this.isBrowser) return []; // ⚠️ Empêcher les requêtes HTTP côté serveur

    try {
      const response = await axios.get(`${this.apiUrl}/`);
      return response.data.map((arrosage: any) => ({
        id: arrosage._id,
        type: arrosage.typePlante,
        morning: arrosage.heureMatin,
        evening: arrosage.heureSoir,
        water: arrosage.quantiteEau
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des arrosages :", error);
      throw error;
    }
  }

   // Supprimer une programmation d'arrosage
   async supprimerArrosage(arrosage: any) {
    try {
      await axios.delete(`${this.apiUrl}/${arrosage.id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'arrosage :", error);
      throw error;
    }
  }

  // Mettre à jour une programmation d'arrosage
  async updateArrosage(arrosage: any) {
    const today = new Date().toISOString().split('T')[0];
  
    if (arrosage.date < today) {
      throw new Error("La date choisie est antérieure à aujourd'hui.");
    }
  
    const payload: { [key: string]: any } = {
      typePlante: arrosage.type,
      heureMatin: arrosage.morning,
      heureSoir: arrosage.evening,
      quantiteEau: arrosage.water
    };
  
    // Supprime les champs non définis
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });
  
    try {
      const response = await axios.put(`${this.apiUrl}/${arrosage.id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'arrosage :", error);
      throw error;
    }
  }
  

}
