import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Client {
  idClient: number;
  typeClient: 'PHYSIQUE' | 'MORAL';
  nom?: string;
  prenom?: string;
  nomEntreprise?: string;
  secteurActivite?: string;
  tel: string;
  email: string;
  adresse: string;
  prospections?: any[];
}

@Injectable({
  providedIn: 'root'   
})
export class ClientService {
  private baseURL = 'http://localhost:8080/api/v1/clients';

  constructor(private http: HttpClient) { }

  getClientsList(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseURL).pipe(
      catchError(this.handleError)
    );
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseURL, client).pipe(
      catchError(this.handleError)
    );
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseURL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateClient(client: Client): Observable<Client> {
    if (!client.idClient) throw new Error("L'ID du client est requis pour la mise à jour");
    return this.http.put<Client>(`${this.baseURL}/${client.idClient}`, client).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.error && error.error.error) {
        errorMessage = error.error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('Erreur suppression client :', error);
    return throwError(() => ({ status: error.status, message: errorMessage }));
  }
}