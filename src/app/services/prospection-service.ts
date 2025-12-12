import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client-service';

export interface Prospection {
  id?: number;
  client: Client;
  domaine: string;
  besoin: string;
  type: string;
  statut: string;
  dateContact: string;
  montantEstime?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProspectionService {
  private baseURL = 'http://localhost:8080/api/v1/prospection'; 

  constructor(private http: HttpClient) {}

  getProspections(): Observable<Prospection[]> {
    return this.http.get<Prospection[]>(this.baseURL);
  }

  createProspection(prospection: Prospection): Observable<Prospection> {
    return this.http.post<Prospection>(this.baseURL, prospection);
  }
}
