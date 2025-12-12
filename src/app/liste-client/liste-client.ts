import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Client, ClientService } from '../services/client-service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-list-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-client.html',
  styleUrls: ['./liste-client.css'],
})
export class ListClientComponent implements OnInit {

  clients: Client[] = [];
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable();

  clientToDelete?: Client;
  showDeleteConfirm: boolean = false;
  searchTerm: string = '';

  constructor(
    private router: Router,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClientsList().subscribe({
      next: (data) => {
        this.clients = data;
        this.clientsSubject.next(data);
      },
      error: (err) => console.error('Erreur récupération clients :', err)
    });
  }

  createClient(): void {
    this.router.navigate(['/createClient']);
  }

  editClient(client: Client): void {
    if (!client.idClient) return;
    this.router.navigate(['/modifier-client', client.idClient]);
  }

  confirmDelete(client: Client): void {
    this.clientToDelete = client;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.clientToDelete = undefined;
    this.showDeleteConfirm = false;
  }

  deleteClient(): void {
    if (!this.clientToDelete?.idClient) return;

    this.clientService.deleteClient(this.clientToDelete.idClient).subscribe({
      next: () => {
        this.clients = this.clients.filter(c => c.idClient !== this.clientToDelete!.idClient);
        this.clientsSubject.next(this.clients);
        this.cancelDelete();
      },
      error: (err) => console.error('Erreur suppression client :', err)
    });
  }

  filteredClients(): Client[] {
    if (!this.searchTerm) return this.clients;
    const term = this.searchTerm.toLowerCase();

    return this.clients.filter(c =>
      (c.typeClient === 'PHYSIQUE'
        ? `${c.nom ?? ''} ${c.prenom ?? ''}`.toLowerCase().includes(term)
        : (c.nomEntreprise ?? '').toLowerCase().includes(term)) ||
      (c.email ?? '').toLowerCase().includes(term) ||
      (c.tel ?? '').toLowerCase().includes(term)
    );
  }

  applyFilter(): void {
    console.log('Recherche appliquée pour :', this.searchTerm);
  }
}
