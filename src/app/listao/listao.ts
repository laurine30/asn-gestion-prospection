import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppelOffreService } from '../services/appel-offre-service';

export interface AppelOffre {
  idAo?: number;
  titre: string;
  datePublic: string;
  dateRponse?: string;
  statut?: string;
}

@Component({
  selector: 'app-listao',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listao.html',
  styleUrls: ['./listao.css']
})
export class ListAoComponent implements OnInit {

  appelOffres: AppelOffre[] = [];
  message: string = '';
  searchTerm: string = '';
  showForm: boolean = false; 
  showDeleteConfirm: boolean = false;
  isEditMode: boolean = false;
  currentAoId?: number;
  aoToDelete?: AppelOffre;
  form: FormGroup;
  
  statuts = [
    { value: 'Ouvert', label: 'Ouvert' },
    { value: 'En analyse', label: 'En analyse' },
    { value: 'Attribué', label: 'Attribué' },
    { value: 'Clôturé', label: 'Clôturé' }
  ];

  constructor(
    private aoService: AppelOffreService, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      datePublic: ['', Validators.required],
      dateRponse: [''],
      statut: ['Ouvert', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAppels();
  }

  loadAppels() {
    this.aoService.getAll().subscribe({
      next: (data) => this.appelOffres = data,
      error: (err) => {
        console.error('Erreur lors du chargement des AO', err);
        this.message = "Impossible de charger la liste des AO.";
      }
    });
  }

  filteredAppelOffres(): AppelOffre[] {
    if (!this.searchTerm) return this.appelOffres;
    return this.appelOffres.filter(ao =>
      ao.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (ao.statut && ao.statut.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (ao.datePublic && ao.datePublic.includes(this.searchTerm))
    );
  }

  applyFilter(): void {
    // La recherche se fait automatiquement via filteredAppelOffres()
  }

  // Couleur selon le statut
  getStatutColor(statut?: string): string {
    switch (statut) {
      case 'Ouvert': return '#4caf50';
      case 'En analyse': return '#ff9800';
      case 'Attribué': return '#2196f3';
      case 'Clôturé': return '#f44336';
      default: return '#000';
    }
  }

  // Afficher le formulaire de création EN POPUP
  createAppelOffre() {
    this.showForm = true;
    this.isEditMode = false;
    this.currentAoId = undefined;
    this.form.reset({
      statut: 'Ouvert',
      dateRponse: '',
      datePublic: new Date().toISOString().split('T')[0]
    });
    this.message = '';
  }

  // Fermer le popup
  closeForm() {
    this.showForm = false;
    this.form.reset();
    this.message = '';
  }

  // Fermer en cliquant sur le backdrop
  closeModalOnBackdrop(event: MouseEvent) {
    this.closeForm();
  }

  // Soumettre le formulaire
  submitAppelOffre() {
    if (this.form.valid) {
      const formData = this.form.value;
      
      if (this.isEditMode && this.currentAoId) {
        // Mode édition
        this.aoService.update(this.currentAoId, formData).subscribe({
          next: (data) => {
            this.message = "Appel d'offre modifié avec succès !";
            this.loadAppels();
            setTimeout(() => this.closeForm(), 2000);
          },
          error: (err) => {
            console.error('Erreur lors de la modification:', err);
            this.message = "Erreur lors de la modification.";
          }
        });
      } else {
        // Mode création
        this.aoService.create(formData).subscribe({
          next: (data) => {
            this.message = "Appel d'offre enregistré avec succès !";
            this.appelOffres.push(data);
            setTimeout(() => this.closeForm(), 2000);
          },
          error: (err) => {
            console.error('Erreur lors de la création:', err);
            this.message = "Erreur lors de l'enregistrement.";
          }
        });
      }
    } else {
      // Marquer tous les champs comme touchés
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  // Éditer un AO
  editAppelOffre(ao: AppelOffre) {
    this.showForm = true;
    this.isEditMode = true;
    this.currentAoId = ao.idAo;
    
    this.form.patchValue({
      titre: ao.titre,
      datePublic: ao.datePublic,
      dateRponse: ao.dateRponse || '',
      statut: ao.statut || 'Ouvert'
    });
  }

  // Confirmer suppression
  confirmDelete(ao: AppelOffre) {
    this.aoToDelete = ao;
    this.showDeleteConfirm = true;
  }

  // Annuler suppression
  cancelDelete() {
    this.showDeleteConfirm = false;
    this.aoToDelete = undefined;
  }

  // Supprimer un AO
  deleteAppelOffre() {
    if (this.aoToDelete?.idAo) {
      this.aoService.delete(this.aoToDelete.idAo).subscribe({
        next: () => {
          this.appelOffres = this.appelOffres.filter(ao => ao.idAo !== this.aoToDelete!.idAo);
          this.message = "Appel d'offre supprimé avec succès.";
          this.cancelDelete();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.message = "Erreur lors de la suppression.";
          this.cancelDelete();
        }
      });
    }
  }

  // Voir les détails
  viewDetails(ao: AppelOffre) {
    console.log('Détails de l\'appel d\'offre:', ao);
    // Implémenter la logique pour afficher les détails
    // Par exemple: this.router.navigate(['/appel-offre', ao.idAo]);
  }

  // Vérifier les erreurs de validation
  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}