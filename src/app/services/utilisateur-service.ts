// utilisateur.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Role } from './role-service';



export interface Utilisateur {
  idUser?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: Role;
  userUpdate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private apiUrl = 'http://localhost:8080/api/v1/utilisateurs';

  constructor(private http: HttpClient) {}

  createUtilisateur(user: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, user);
  }
}

