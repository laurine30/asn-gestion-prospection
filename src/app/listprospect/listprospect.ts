import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListProspectionService, ProspectionDTO } from '../services/listprospect-service';
import { ClientService, Client } from '../services/client-service';

@Component({
  selector: 'app-listprospect',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listprospect.html',
  styleUrls: ['./listprospect.css']
})
export class Listprospect implements OnInit {
  prospections: ProspectionDTO[] = [];
  prospectionToDelete?: ProspectionDTO;
  prospectionToView?: ProspectionDTO; // 🆕 Pour afficher les détails
  showDeleteConfirm = false;
  showForm = false;
  showDetailsModal = false; // 🆕 Modal de détails
  searchTerm = '';
  successMessage = '';
  isEditMode = false;
  currentProspectionId?: number; // 🆕 Pour l'édition
  isSubmitting = false;
  
  form!: FormGroup;
  
  clients: Client[] = [];
  typesProspection = [
    { value: 'appel_offres', label: 'Appel d\'offres' },
    { value: 'prospection_directe', label: 'Prospection directe' },
    { value: 'recommandation', label: 'Recommandation' }
  ];
  statuts = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Gagnée', label: 'Gagnée' },
    { value: 'Perdue', label: 'Perdue' }
  ];

  constructor(
    private service: ListProspectionService,
    private fb: FormBuilder,
    private clientService: ClientService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Écouter les changements de prospections
    this.service.prospections$.subscribe(data => {
      this.prospections = data;
    });
    
    // Charger les données
    this.service.loadProspections();
    this.loadClients();
  }

  initForm(): void {
    this.form = this.fb.group({
      id_client: [null, Validators.required],
      domaine: ['', Validators.required],
      besoin: ['', [Validators.required, Validators.minLength(10)]],
      type: [null, Validators.required],
      statut: ['En attente', Validators.required],
      dateContact: ['', Validators.required],
      montantEstime: [0]
    });

    // Écoute les changements sur le champ client pour auto-remplir le domaine
    this.form.get('id_client')?.valueChanges.subscribe(clientId => {
      this.onClientSelected(clientId);
    });
  }

  // Auto-remplir le secteur d'activité quand un client est sélectionné
  onClientSelected(clientId: number | null): void {
    if (!clientId) {
      this.form.patchValue({ domaine: '' });
      return;
    }

    const selectedClient = this.clients.find(c => c.idClient === clientId);
    
    if (selectedClient && selectedClient.secteurActivite) {
      this.form.patchValue({ domaine: selectedClient.secteurActivite });
    } else {
      this.form.patchValue({ domaine: '' });
    }
  }

  // Charger la liste des clients
  loadClients(): void {
    this.clientService.getClientsList().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients:', err);
        this.clients = [];
      }
    });
  }

  // Ouvrir le formulaire de création
  createProspection(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.currentProspectionId = undefined;
    this.form.reset({
      statut: 'En attente',
      montantEstime: 0
    });
    this.successMessage = '';
  }

  // Ouvrir le formulaire d'édition
  editProspection(p: ProspectionDTO): void {
    this.showForm = true;
    this.isEditMode = true;
    this.currentProspectionId = p.idProspection;
    
    // Pré-remplir le formulaire
    this.form.patchValue({
      id_client: p.clientId,
      domaine: p.domaine,
      besoin: p.besoin,
      type: p.type,
      statut: p.statut,
      dateContact: p.dateContact,
      montantEstime: p.montantEstime || 0
    });
    
    this.successMessage = '';
  }

  // Fermer le formulaire
  closeForm(): void {
    this.showForm = false;
    this.isEditMode = false;
    this.currentProspectionId = undefined;
    this.form.reset();
    this.successMessage = '';
    this.isSubmitting = false;
  }

  closeModalOnBackdrop(event: MouseEvent): void {
    if (!this.isSubmitting) {
      this.closeForm();
    }
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Soumettre le formulaire (création ou modification)
  submit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    const formData = this.form.value;

    if (this.isEditMode && this.currentProspectionId) {
      // Mode édition
      this.service.updateProspection(this.currentProspectionId, formData).subscribe({
        next: (response) => {
          this.successMessage = 'Prospection mise à jour avec succès !';
          setTimeout(() => {
            this.closeForm();
          }, 2000);
        },
        error: (err) => {
          console.error('Erreur lors de la modification:', err);
          this.successMessage = 'Erreur lors de la modification';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    } else {
      // Mode création
      this.service.createProspection(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Prospection créée avec succès !';
          setTimeout(() => {
            this.closeForm();
          }, 2000);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          this.successMessage = 'Erreur lors de la création';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    }
  }

  // 🆕 Afficher les détails d'une prospection
  viewDetails(p: ProspectionDTO): void {
    this.prospectionToView = p;
    this.showDetailsModal = true;
  }

  // 🆕 Fermer le modal de détails
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.prospectionToView = undefined;
  }

  // Confirmer la suppression
  confirmDelete(p: ProspectionDTO): void {
    this.prospectionToDelete = p;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.prospectionToDelete = undefined;
  }

  // Supprimer une prospection
  deleteProspection(): void {
    if (!this.prospectionToDelete?.idProspection) return;
    
    this.service.deleteProspection(this.prospectionToDelete.idProspection).subscribe({
      next: () => {
        this.cancelDelete();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression. Vérifiez que la prospection n\'est pas déjà gagnée.');
        this.cancelDelete();
      }
    });
  }

  // Filtrer les prospections
  filteredProspections(): ProspectionDTO[] {
    if (!this.searchTerm) return this.prospections;
    const term = this.searchTerm.toLowerCase();
    return this.prospections.filter(p =>
      (p.nomClient?.toLowerCase().includes(term) || false) ||
      (p.type?.toLowerCase().includes(term) || false) ||
      (p.statut?.toLowerCase().includes(term) || false) ||
      (p.domaine?.toLowerCase().includes(term) || false)
    );
  }

  applyFilter(): void {
    // La recherche se fait automatiquement via filteredProspections()
  }

  getStatutColor(statut: string): string {
    switch(statut) {
      case 'En cours': return '#ff9800';
      case 'Validé': 
      case 'Gagnée': return '#4caf50';
      case 'En attente': return '#2196f3';
      case 'Rejeté':
      case 'Perdue': return '#f44336';
      default: return '#000';
    }
  }

  getTypeIcon(type: string): string {
    switch(type) {
      case 'appel_offres': return 'fa-file-contract';
      case 'prospection_directe': return 'fa-phone';
      case 'recommandation': return 'fa-handshake';
      default: return 'fa-question';
    }
  }

  getStatutIcon(statut: string): string {
    switch(statut) {
      case 'En attente': return 'fa-clock text-blue-500';
      case 'Gagnée': return 'fa-check-circle text-green-500';
      case 'Perdue': return 'fa-times-circle text-red-500';
      default: return 'fa-circle';
    }
  }

  // 🆕 Formater le type de prospection pour l'affichage
  getTypeLabel(type: string): string {
    const found = this.typesProspection.find(t => t.value === type);
    return found ? found.label : type;
  }

  // 🆕 Formater la date pour l'affichage
  formatDate(date: string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }
}