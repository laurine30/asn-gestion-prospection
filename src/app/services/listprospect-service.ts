import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ProspectionDTO {
  idProspection?: number;
  statut: string;
  datePublication?: string;
  userUpdate?: string;
  dateUpdate?: string;
  clientId: number;
  nomClient?: string;
  domaine: string;
  besoin: string;
  type: string;
  montantEstime?: number;
  dateContact: string;
}

@Injectable({
  providedIn: 'root'
})
export class ListProspectionService {

  private apiUrl = 'http://localhost:8080/api/v1/prospection';

  // Observable pour partager la liste entre composants
  private prospectionsSubject = new BehaviorSubject<ProspectionDTO[]>([]);
  prospections$ = this.prospectionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Charger toutes les prospections depuis le backend
  loadProspections(): void {
    this.http.get<ProspectionDTO[]>(this.apiUrl).subscribe({
      next: data => this.prospectionsSubject.next(data),
      error: err => console.error('Erreur chargement prospections:', err)
    });
  }

  // Créer une nouvelle prospection
  createProspection(formData: any): Observable<ProspectionDTO> {
    const dto = {
      clientId: formData.id_client,
      domaine: formData.domaine,
      besoin: formData.besoin,
      type: formData.type,
      statut: formData.statut,
      dateContact: formData.dateContact,
      montantEstime: formData.montantEstime || 0
    };

    return this.http.post<ProspectionDTO>(this.apiUrl, dto).pipe(
      tap(newProspection => {
        const current = this.prospectionsSubject.getValue();
        // Ajouter au début de la liste (plus récent en premier)
        this.prospectionsSubject.next([newProspection, ...current]);
      })
    );
  }

  // Mettre à jour une prospection
  updateProspection(id: number, formData: any): Observable<ProspectionDTO> {
    const dto = {
      clientId: formData.id_client,
      domaine: formData.domaine,
      besoin: formData.besoin,
      type: formData.type,
      statut: formData.statut,
      dateContact: formData.dateContact,
      montantEstime: formData.montantEstime || 0
    };

    return this.http.put<ProspectionDTO>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(updatedProspection => {
        const current = this.prospectionsSubject.getValue();
        const index = current.findIndex(p => p.idProspection === id);
        if (index !== -1) {
          current[index] = updatedProspection;
          this.prospectionsSubject.next([...current]);
        }
      })
    );
  }

  // Supprimer une prospection
  deleteProspection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.prospectionsSubject.getValue();
        const filtered = current.filter(p => p.idProspection !== id);
        this.prospectionsSubject.next(filtered);
      })
    );
  }

  // Obtenir une prospection par ID
  getProspectionById(id: number): Observable<ProspectionDTO> {
    return this.http.get<ProspectionDTO>(`${this.apiUrl}/${id}`);
  }
}