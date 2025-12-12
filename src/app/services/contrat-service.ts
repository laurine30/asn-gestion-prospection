import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface Contrat {
  idContrat: number;
  dateSignature: string;
  conditions: string;
  montantContrat: number;
  statutContrat: string;
  clientId?: number;
  clientNom?: string;
  clientEmail?: string;
  appelOffreId?: number;
  appelOffreTitre?: string;
  appelOffreReference?: string;
}

export interface CreateContratDTO {
  dateSignature: string;      // Format: "2024-12-04T10:30:00"
  conditions: string;
  montantContrat: number;
  statutContrat: string;
  clientId: number;           // CORRECTION : juste clientId, pas d'objet client
  appelOffreId?: number;      // Optionnel
}

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private baseURL = 'http://localhost:8080/api/contrats';
  private contratsSubject = new BehaviorSubject<Contrat[]>([]);
  contrats$ = this.contratsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Charger tous les contrats
  loadContrats(): Observable<Contrat[]> {
    console.log('📥 Chargement des contrats depuis:', this.baseURL);
    return this.http.get<Contrat[]>(this.baseURL).pipe(
      tap(contrats => {
        console.log('✅ Contrats chargés:', contrats.length, 'contrats');
        this.contratsSubject.next(contrats);
      }),
      catchError(error => {
        console.error('❌ Erreur chargement contrats:', error);
        return throwError(() => new Error('Impossible de charger les contrats'));
      })
    );
  }

  // Créer un nouveau contrat - VERSION CORRIGÉE
  createContrat(contratData: CreateContratDTO): Observable<Contrat> {
    console.log('🚀 === CRÉATION CONTRAT ===');
    console.log('📤 URL:', this.baseURL);
    console.log('📝 Données brutes:', contratData);
    
    // Validation
    if (!contratData.dateSignature || !contratData.conditions || 
        !contratData.montantContrat || !contratData.statutContrat || 
        !contratData.clientId) {
      console.error('❌ Données manquantes:', contratData);
      return throwError(() => new Error('Tous les champs obligatoires doivent être remplis'));
    }

    // Formatage des données pour le backend Spring
    const dataToSend = {
      dateSignature: this.formatDateForBackend(contratData.dateSignature),
      conditions: contratData.conditions.trim(),
      montantContrat: Number(contratData.montantContrat),
      statutContrat: contratData.statutContrat.trim(),
      clientId: contratData.clientId,
      appelOffreId: contratData.appelOffreId || null
    };

    console.log('📦 Données envoyées au backend:', JSON.stringify(dataToSend, null, 2));
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<Contrat>(this.baseURL, dataToSend, { headers }).pipe(
      tap(response => {
        console.log('✅ Contrat créé avec succès:', response);
        // Ajouter au Subject
        const current = this.contratsSubject.value;
        this.contratsSubject.next([...current, response]);
      }),
      catchError(error => {
        console.error('❌ Erreur création contrat:', error);
        let errorMessage = 'Erreur lors de la création du contrat';
        
        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Mettre à jour un contrat
  updateContrat(id: number, contratData: Partial<CreateContratDTO>): Observable<Contrat> {
    console.log('🔄 Mise à jour contrat ID:', id);
    
    const dataToSend: any = {};
    
    // Ajouter seulement les champs qui existent
    if (contratData.dateSignature) {
      dataToSend.dateSignature = this.formatDateForBackend(contratData.dateSignature);
    }
    if (contratData.conditions !== undefined) {
      dataToSend.conditions = contratData.conditions.trim();
    }
    if (contratData.montantContrat !== undefined) {
      dataToSend.montantContrat = Number(contratData.montantContrat);
    }
    if (contratData.statutContrat !== undefined) {
      dataToSend.statutContrat = contratData.statutContrat.trim();
    }
    if (contratData.clientId !== undefined) {
      dataToSend.clientId = contratData.clientId;
    }
    if (contratData.appelOffreId !== undefined) {
      dataToSend.appelOffreId = contratData.appelOffreId;
    }
    
    console.log('📦 Données de mise à jour:', dataToSend);
    
    return this.http.put<Contrat>(`${this.baseURL}/${id}`, dataToSend, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      tap(updatedContrat => {
        console.log('✅ Contrat mis à jour:', updatedContrat);
        // Mettre à jour le Subject
        const current = this.contratsSubject.value;
        const index = current.findIndex(c => c.idContrat === id);
        if (index !== -1) {
          current[index] = updatedContrat;
          this.contratsSubject.next([...current]);
        }
      }),
      catchError(error => {
        console.error('❌ Erreur mise à jour:', error);
        return throwError(() => error);
      })
    );
  }

  // Supprimer un contrat
  deleteContrat(id: number): Observable<any> {
    console.log('🗑️ Suppression contrat ID:', id);
    
    return this.http.delete(`${this.baseURL}/${id}`).pipe(
      tap(() => {
        console.log('✅ Contrat supprimé');
        // Retirer du Subject
        const current = this.contratsSubject.value;
        this.contratsSubject.next(current.filter(c => c.idContrat !== id));
      }),
      catchError(error => {
        console.error('❌ Erreur suppression:', error);
        return throwError(() => error);
      })
    );
  }

  // Helper methods
  private formatDateForBackend(date: string): string {
    if (!date) return '';
    
    // Si la date est déjà au format YYYY-MM-DD
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date + 'T00:00:00';
    }
    
    // Si c'est un Date ISO
    try {
      const d = new Date(date);
      return d.toISOString().split('.')[0]; // Format: 2024-12-04T10:30:00
    } catch (e) {
      console.error('❌ Erreur formatage date:', date, e);
      return date;
    }
  }

  // Obtenir les statuts (correspondant au backend)
  getStatuts(): { value: string, label: string }[] {
    return [
      { value: 'ACTIF', label: 'Actif' },
      { value: 'EN_ATTENTE', label: 'En attente' },
      { value: 'SUSPENDU', label: 'Suspendu' },
      { value: 'TERMINE', label: 'Terminé' },
      { value: 'EN_NEGOCIATION', label: 'En négociation' },
      { value: 'SIGNÉ', label: 'Signé' },
      { value: 'RESILIÉ', label: 'Résilié' },
      { value: 'EN_ATTENTE_SIGNATURE', label: 'En attente signature' }
    ];
  }

  // Méthode pour tester
  testConnection(): Observable<any> {
    console.log('🔍 Test connexion API...');
    return this.http.get(this.baseURL).pipe(
      tap(() => console.log('✅ API accessible')),
      catchError(error => {
        console.error('❌ API inaccessible:', error);
        return throwError(() => error);
      })
    );
  }
}