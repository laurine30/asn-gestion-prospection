import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Client, ClientService } from '../services/client-service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client.html',
  styleUrls: ['./client.css']
})
export class ClientFormComponent implements OnInit {

  form: FormGroup;
  clients: Client[] = [];
  private clientsSubject = new BehaviorSubject<Client[]>([]);
  clients$ = this.clientsSubject.asObservable();

  clientToDelete?: Client;
  clientToView?: Client; // 🆕 Pour afficher les détails
  showDeleteConfirm = false;
  showDetailsModal = false; // 🆕 Modal de détails
  searchTerm = '';
  showForm = false;
  successMessage = '';
  isEditMode = false;
  isSubmitting = false;
  currentClientId?: number; // 🆕 Pour l'édition

  constructor(
    private fb: FormBuilder, 
    private clientService: ClientService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      typeClient: ['', Validators.required],
      nom: [''],
      prenom: [''],
      nomEntreprise: [''],
      secteurActivite: [''],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClients();

    // Met à jour les validateurs selon le type de client
    this.form.get('typeClient')?.valueChanges.subscribe(type => {
      if (type === 'PHYSIQUE') {
        this.form.get('nom')?.setValidators([Validators.required]);
        this.form.get('prenom')?.setValidators([Validators.required]);
        this.form.get('nomEntreprise')?.clearValidators();
      } else if (type === 'MORAL') {
        this.form.get('nomEntreprise')?.setValidators([Validators.required]);
        this.form.get('nom')?.clearValidators();
        this.form.get('prenom')?.clearValidators();
      }
      this.form.get('nom')?.updateValueAndValidity();
      this.form.get('prenom')?.updateValueAndValidity();
      this.form.get('nomEntreprise')?.updateValueAndValidity();
    });
  }

  loadClients() {
    this.clientService.getClientsList().subscribe({
      next: data => {
        this.clients = data;
        this.clientsSubject.next(data);
      },
      error: err => console.error('Erreur chargement clients :', err)
    });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  filteredClients(): Client[] {
    if (!this.searchTerm) return this.clients;
    const term = this.searchTerm.toLowerCase();
    return this.clients.filter(c =>
      ((c.typeClient === 'PHYSIQUE' ? (c.nom + ' ' + c.prenom) : c.nomEntreprise) || '').toLowerCase().includes(term) ||
      (c.tel || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term)
    );
  }

  // 🆕 Afficher les détails d'un client
  viewDetails(client: Client): void {
    this.clientToView = client;
    this.showDetailsModal = true;
  }

  // 🆕 Fermer le modal de détails
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.clientToView = undefined;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    const formValue = { ...this.form.value };

    // Nettoyer les champs selon le type
    if (formValue.typeClient === 'PHYSIQUE') {
      formValue.nomEntreprise = null;
    } else if (formValue.typeClient === 'MORAL') {
      formValue.nom = null;
      formValue.prenom = null;
    }

    if (this.isEditMode && this.currentClientId) {
      // Mode édition
      const clientToUpdate = { ...formValue, idClient: this.currentClientId };
      
      this.clientService.updateClient(clientToUpdate).subscribe({
        next: (updatedClient: Client) => {
          // Mettre à jour dans la liste
          const index = this.clients.findIndex(c => c.idClient === this.currentClientId);
          if (index !== -1) {
            this.clients[index] = updatedClient;
            this.clientsSubject.next([...this.clients]);
          }

          this.successMessage = 'Client modifié avec succès !';
          
          setTimeout(() => {
            this.resetForm();
          }, 2000);
        },
        error: err => {
          console.error('Erreur modification client :', err);
          this.successMessage = 'Erreur lors de la modification du client';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    } else {
      // Mode création
      this.clientService.createClient(formValue).subscribe({
        next: (client: Client) => {
          this.clients.unshift(client);
          this.clientsSubject.next(this.clients);

          this.successMessage = 'Client créé avec succès !';
          
          setTimeout(() => {
            this.resetForm();
          }, 2000);
        },
        error: err => {
          console.error('Erreur création client :', err);
          this.successMessage = 'Erreur lors de la création du client';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    }
  }

  // Ouvrir le formulaire de création
  openForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.currentClientId = undefined;
    this.form.reset();
    this.successMessage = '';
    this.isSubmitting = false;
  }

  // 🆕 Ouvrir le formulaire de modification
  editClient(client: Client) {
    this.showForm = true;
    this.isEditMode = true;
    this.currentClientId = client.idClient;
    
    // Pré-remplir le formulaire avec les données du client
    this.form.patchValue({
      typeClient: client.typeClient,
      nom: client.nom || '',
      prenom: client.prenom || '',
      nomEntreprise: client.nomEntreprise || '',
      secteurActivite: client.secteurActivite || '',
      tel: client.tel,
      email: client.email,
      adresse: client.adresse
    });
    
    this.successMessage = '';
    this.isSubmitting = false;
  }

  // Fermer / annuler le formulaire
  resetForm() {
    this.form.reset();
    this.showForm = false;
    this.isEditMode = false;
    this.currentClientId = undefined;
    this.successMessage = '';
    this.isSubmitting = false;
  }

  // Fermer le modal en cliquant sur le backdrop
  closeModalOnBackdrop(event: MouseEvent) {
    if (!this.isSubmitting) {
      this.resetForm();
    }
  }

  // Supprimer client
  confirmDelete(client: Client) {
    this.clientToDelete = client;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.clientToDelete = undefined;
    this.showDeleteConfirm = false;
  }

  deleteClient() {
    if (!this.clientToDelete?.idClient) return;
    
    this.clientService.deleteClient(this.clientToDelete.idClient).subscribe({
      next: () => {
        this.clients = this.clients.filter(c => c.idClient !== this.clientToDelete!.idClient);
        this.clientsSubject.next(this.clients);
        this.clientToDelete = undefined;
        this.showDeleteConfirm = false;
      },
      error: err => console.error('Erreur suppression client :', err)
    });
  }

  // 🆕 Obtenir le nom complet du client pour l'affichage
  getClientDisplayName(client: Client): string {
    return client.typeClient === 'PHYSIQUE' 
      ? `${client.nom} ${client.prenom}` 
      : client.nomEntreprise || '';
  }
}