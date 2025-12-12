import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface UtilisateurDTO {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  actif: boolean;
  userUpdate?: string;
  dateUpdate?: string;
  idClient?: number;
  idRole?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ListUtilisateurService {
  private baseUrl = 'http://localhost:8080/api/v1/utilisateurs';

  private _utilisateurs$ = new BehaviorSubject<UtilisateurDTO[]>([]);
  utilisateurs$ = this._utilisateurs$.asObservable();

  constructor(private http: HttpClient) {}

  loadUtilisateurs(): void {
    this.http.get<UtilisateurDTO[]>(this.baseUrl).subscribe({
      next: data => this._utilisateurs$.next(data),
      error: err => {
        console.error('Erreur chargement utilisateurs:', err);
        this._utilisateurs$.next([]);
      }
    });
  }

  createUtilisateur(u: Partial<UtilisateurDTO>): Observable<UtilisateurDTO> {
    return this.http.post<UtilisateurDTO>(this.baseUrl, u)
      .pipe(tap(() => this.loadUtilisateurs()));
  }

  updateUtilisateur(id: number, u: Partial<UtilisateurDTO>): Observable<UtilisateurDTO> {
    return this.http.put<UtilisateurDTO>(`${this.baseUrl}/${id}`, u)
      .pipe(tap(() => this.loadUtilisateurs()));
  }

  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this.loadUtilisateurs()));
  }

  toggleActivation(id: number): Observable<string> {
    return this.http.patch<string>(`${this.baseUrl}/${id}/toggle`, {});
  }

  changePassword(id: number, nouveauMdp: string): Observable<string> {
    return this.http.patch<string>(`${this.baseUrl}/${id}/password`, nouveauMdp);
  }
}
