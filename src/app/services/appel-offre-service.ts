import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppelOffre } from '../appeloffre/appeloffre';


@Injectable({
  providedIn: 'root'
})
export class AppelOffreService {

  private apiUrl = 'http://localhost:8080/api/v1/appelOffres'; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<AppelOffre[]> {
    return this.http.get<AppelOffre[]>(this.apiUrl);
  }

  getById(id: number): Observable<AppelOffre> {
    return this.http.get<AppelOffre>(`${this.apiUrl}/${id}`);
  }

  create(ao: AppelOffre): Observable<AppelOffre> {
    return this.http.post<AppelOffre>(this.apiUrl, ao);
  }

  update(id: number, ao: AppelOffre): Observable<AppelOffre> {
    return this.http.put<AppelOffre>(`${this.apiUrl}/${id}`, ao);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
