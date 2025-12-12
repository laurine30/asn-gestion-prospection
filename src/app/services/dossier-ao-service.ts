import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dossier {
  idDossier?: number;
  referenceAo: string;
  intituleAo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DossierAoService {

  private apiUrl = 'http://localhost:8080/api/v1/dossiers';

  constructor(private http: HttpClient) { }

  
  getAll(): Observable<Dossier[]> {
    return this.http.get<Dossier[]>(this.apiUrl);
  }

  getById(id: number): Observable<Dossier> {
    return this.http.get<Dossier>(`${this.apiUrl}/${id}`);
  }

  create(dossier: Dossier): Observable<Dossier> {
    return this.http.post<Dossier>(this.apiUrl, dossier);
  }

  update(id: number, dossier: Dossier): Observable<Dossier> {
    return this.http.put<Dossier>(`${this.apiUrl}/${id}`, dossier);
  }

 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

