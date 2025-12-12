import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contrat, ContratService, CreateContratDTO } from '../services/contrat-service';
import { Client, ClientService } from '../services/client-service';
import { AppelOffreService } from '../services/appel-offre-service';

@Component({
  selector: 'app-contrat-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contratlist.html',
  styleUrls: ['./contratlist.css']
})
export class ContratListComponent implements OnInit {
  contrats: Contrat[] = [];
  filteredContrats: Contrat[] = [];
  clients: Client[] = [];
  appelOffres: any[] = [];
  searchTerm: string = '';
  
  // Pour la modal
  showFormModal: boolean = false;
  showDetailsModal: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  currentContrat: Contrat | null = null;
  contratToDelete: Contrat | null = null;
  
  // Form data - CORRIGÉ
  formData: CreateContratDTO = {
    dateSignature: new Date().toISOString().split('T')[0],
    conditions: '',
    montantContrat: 0,
    statutContrat: 'ACTIF',
    clientId: 0  // Initialisé à 0
  };
  
  // Statuts
  statuts: any[] = [];
  
  // Message d'erreur/loading
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private contratService: ContratService,
    private clientService: ClientService,
    private appelOffreService: AppelOffreService
  ) {}

  ngOnInit(): void {
    this.testAPIConnection();
    this.loadContrats();
    this.loadClients();
    this.loadAppelOffres();
    this.statuts = this.contratService.getStatuts();
  }

  testAPIConnection(): void {
    this.contratService.testConnection().subscribe({
      next: () => console.log('✅ Connexion API établie'),
      error: (err) => console.error('❌ Problème de connexion API:', err)
    });
  }

  loadContrats(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.contratService.loadContrats().subscribe({
      next: (data) => {
        this.contrats = data;
        this.filteredContrats = data;
        this.loading = false;
        console.log('✅ Contrats chargés:', data.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement contrats:', err);
        this.errorMessage = err.message || 'Impossible de charger les contrats';
        this.loading = false;
      }
    });
  }

  loadClients(): void {
    this.clientService.getClientsList().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        console.log('✅ Clients chargés:', data.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement clients:', err);
        this.errorMessage = err.message || 'Impossible de charger les clients';
      }
    });
  }

  loadAppelOffres(): void {
    this.appelOffreService.getAll().subscribe({
      next: (data) => {
        this.appelOffres = data;
        console.log('✅ Appels d\'offre chargés:', data.length);
      },
      error: (err) => console.error('❌ Erreur chargement AO:', err)
    });
  }

  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredContrats = this.contrats;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredContrats = this.contrats.filter(contrat =>
      (contrat.clientNom || '').toLowerCase().includes(term) ||
      contrat.statutContrat.toLowerCase().includes(term) ||
      contrat.conditions.toLowerCase().includes(term) ||
      contrat.montantContrat.toString().includes(term)
    );
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.formData = {
      dateSignature: new Date().toISOString().split('T')[0],
      conditions: '',
      montantContrat: 1000, // Valeur par défaut
      statutContrat: 'ACTIF',
      clientId: 0
    };
    
    this.showFormModal = true;
  }

  openEditModal(contrat: Contrat): void {
    this.isEditMode = true;
    this.currentContrat = contrat;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.formData = {
      dateSignature: contrat.dateSignature ? 
        new Date(contrat.dateSignature).toISOString().split('T')[0] : 
        new Date().toISOString().split('T')[0],
      conditions: contrat.conditions || '',
      montantContrat: contrat.montantContrat || 0,
      statutContrat: contrat.statutContrat || 'ACTIF',
      clientId: contrat.clientId || 0,
      appelOffreId: contrat.appelOffreId
    };
    
    this.showFormModal = true;
  }

  submitForm(): void {
    console.log('📝 Début submitForm');
    
    // Validation
    if (!this.formData.dateSignature) {
      this.errorMessage = 'La date de signature est obligatoire';
      return;
    }
    if (!this.formData.conditions || this.formData.conditions.trim().length === 0) {
      this.errorMessage = 'Les conditions sont obligatoires';
      return;
    }
    if (!this.formData.montantContrat || this.formData.montantContrat <= 0) {
      this.errorMessage = 'Le montant doit être positif';
      return;
    }
    if (!this.formData.statutContrat || this.formData.statutContrat.trim().length === 0) {
      this.errorMessage = 'Le statut est obligatoire';
      return;
    }
    if (!this.formData.clientId || this.formData.clientId === 0) {
      this.errorMessage = 'Veuillez sélectionner un client';
      return;
    }
    
    console.log('✅ Validation passée, données:', this.formData);
    
    if (this.isEditMode && this.currentContrat) {
      this.contratService.updateContrat(this.currentContrat.idContrat, this.formData).subscribe({
        next: () => {
          console.log('✅ Contrat mis à jour');
          this.successMessage = 'Contrat mis à jour avec succès';
          setTimeout(() => {
            this.closeModals();
            this.loadContrats();
          }, 1500);
        },
        error: (err) => {
          console.error('❌ Erreur modification:', err);
          this.errorMessage = err.message || 'Erreur lors de la mise à jour du contrat';
        }
      });
    } else {
      this.contratService.createContrat(this.formData).subscribe({
        next: () => {
          console.log('✅ Contrat créé');
          this.successMessage = 'Contrat créé avec succès';
          setTimeout(() => {
            this.closeModals();
            this.loadContrats();
          }, 1500);
        },
        error: (err) => {
          console.error('❌ Erreur création:', err);
          this.errorMessage = err.message || 'Erreur lors de la création du contrat';
        }
      });
    }
  }

  closeModals(): void {
    this.showFormModal = false;
    this.showDetailsModal = false;
    this.showDeleteModal = false;
    this.currentContrat = null;
    this.contratToDelete = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openDetailsModal(contrat: Contrat): void {
    this.currentContrat = contrat;
    this.showDetailsModal = true;
  }

  openDeleteModal(contrat: Contrat): void {
    this.contratToDelete = contrat;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.contratToDelete) return;
    
    this.contratService.deleteContrat(this.contratToDelete.idContrat).subscribe({
      next: () => {
        console.log('🗑️ Contrat supprimé');
        this.successMessage = 'Contrat supprimé avec succès';
        setTimeout(() => {
          this.closeModals();
          this.loadContrats();
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Erreur suppression:', err);
        this.errorMessage = err.message || 'Erreur lors de la suppression du contrat';
      }
    });
  }

  getStatutColor(statut: string): string {
    switch(statut) {
      case 'EN_ATTENTE': return '#FF9800';
      case 'SUSPENDU': return '#F44336';
      case 'TERMINE': return '#2196F3';
      case 'EN_NEGOCIATION': return '#9C27B0';
      case 'SIGNÉ': return '#3F51B5';
      default: return '#757575';
    }
  }

  formatDate(date: string): string {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return date;
    }
  }

  getStatutLabel(statut: string): string {
    const found = this.statuts.find(s => s.value === statut);
    return found ? found.label : statut;
  }
}