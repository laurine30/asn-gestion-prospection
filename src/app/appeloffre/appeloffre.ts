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
  templateUrl: './appeloffre.html',
  styleUrls: ['./appeloffre.css']
})
export class ListAoComponent implements OnInit {

  appelOffres: AppelOffre[] = [];
  message: string = '';
  searchTerm: string = '';
  showForm: boolean = false; 
  isEditMode: boolean = false;
  currentAoId?: number;
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
    const term = this.searchTerm.toLowerCase();
    return this.appelOffres.filter(ao =>
      ao.titre.toLowerCase().includes(term) ||
      (ao.statut && ao.statut.toLowerCase().includes(term)) ||
      (ao.datePublic && ao.datePublic.includes(this.searchTerm))
    );
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

  // Supprimer un AO
  deleteAppelOffre(id?: number) {
    if (id && confirm('Voulez-vous vraiment supprimer cet appel d\'offre ?')) {
      this.aoService.delete(id).subscribe({
        next: () => {
          this.appelOffres = this.appelOffres.filter(ao => ao.idAo !== id);
          this.message = "Appel d'offre supprimé avec succès.";
          setTimeout(() => this.message = '', 3000);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.message = "Erreur lors de la suppression.";
          setTimeout(() => this.message = '', 3000);
        }
      });
    }
  }

  // Fermer le popup
  closeForm() {
    this.showForm = false;
    this.form.reset();
    this.message = '';
  }

  // Fermer en cliquant sur le backdrop
  closeModalOnBackdrop(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('form-modal')) {
      this.closeForm();
    }
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
            setTimeout(() => this.message = '', 3000);
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
            setTimeout(() => this.message = '', 3000);
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

  // Vérifier les erreurs de validation
  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Méthode pour filtrer (appelée depuis le template)
  applyFilter() {
    // Cette méthode est appelée par l'input de recherche
    // La méthode filteredAppelOffres() se met à jour automatiquement
  }
}