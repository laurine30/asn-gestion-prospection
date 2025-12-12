import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListUtilisateurService, UtilisateurDTO } from '../services/userservice';


@Component({
  selector: 'app-list-utilisateur',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './utilisateurlist.html',
  styleUrls: ['./utilisateurlist.css']
})
export class ListUtilisateurComponent implements OnInit {
  utilisateurs: UtilisateurDTO[] = [];
  utilisateurToDelete?: UtilisateurDTO;
  utilisateurToView?: UtilisateurDTO;
  showDeleteConfirm = false;
  showForm = false;
  showDetailsModal = false;
  searchTerm = '';
  successMessage = '';
  isEditMode = false;
  currentUserId?: number;
  isSubmitting = false;

  form!: FormGroup;

  roles = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Utilisateur' }
  ];

  constructor(
    private service: ListUtilisateurService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.service.utilisateurs$.subscribe(data => this.utilisateurs = data);
    this.service.loadUtilisateurs();
  }

  initForm(): void {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleId: [null, Validators.required],
      actif: [true]
    });
  }

  createUtilisateur(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.currentUserId = undefined;
    this.form.reset({ actif: true });
    this.successMessage = '';
  }

  editUtilisateur(u: UtilisateurDTO): void {
    this.showForm = true;
    this.isEditMode = true;
    this.currentUserId = u.idUser;
    this.form.patchValue({
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      roleId: u.idRole,
      actif: u.actif
    });
  }
  getRoleLabel(roleId?: number): string {
  if (!roleId) return '-';
  const role = this.roles.find(r => r.value === roleId);
  return role ? role.label : '-';
}


  closeForm(): void {
    this.showForm = false;
    this.isEditMode = false;
    this.currentUserId = undefined;
    this.form.reset();
    this.successMessage = '';
    this.isSubmitting = false;
  }

  submit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => this.form.get(key)?.markAsTouched());
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formData = {
      nom: this.form.value.nom,
      prenom: this.form.value.prenom,
      email: this.form.value.email,
      idRole: this.form.value.roleId,
      actif: this.form.value.actif
    };

    if (this.isEditMode && this.currentUserId) {
      this.service.updateUtilisateur(this.currentUserId, formData).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur mis à jour !';
          setTimeout(() => this.closeForm(), 2000);
        },
        error: err => {
          console.error(err);
          this.successMessage = 'Erreur lors de la mise à jour';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    } else {
      this.service.createUtilisateur(formData).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur créé !';
          setTimeout(() => this.closeForm(), 2000);
        },
        error: err => {
          console.error(err);
          this.successMessage = 'Erreur lors de la création';
          this.isSubmitting = false;
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    }
  }

  confirmDelete(u: UtilisateurDTO): void {
    this.utilisateurToDelete = u;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.utilisateurToDelete = undefined;
    this.showDeleteConfirm = false;
  }

  deleteUtilisateur(): void {
    if (!this.utilisateurToDelete) return;
    this.service.deleteUtilisateur(this.utilisateurToDelete.idUser).subscribe({
      next: () => this.cancelDelete(),
      error: err => {
        console.error(err);
        alert('Erreur lors de la suppression');
        this.cancelDelete();
      }
    });
  }

  viewDetails(u: UtilisateurDTO): void {
    this.utilisateurToView = u;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.utilisateurToView = undefined;
    this.showDetailsModal = false;
  }

  filteredUtilisateurs(): UtilisateurDTO[] {
    if (!this.searchTerm) return this.utilisateurs;
    const term = this.searchTerm.toLowerCase();
    return this.utilisateurs.filter(u =>
      u.nom.toLowerCase().includes(term) ||
      u.prenom.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  toggleActivation(u: UtilisateurDTO): void {
    this.service.toggleActivation(u.idUser).subscribe({
      next: () => this.service.loadUtilisateurs(),
      error: err => console.error(err)
    });
  }
}
