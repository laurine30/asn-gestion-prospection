import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Prospection {
  idProspection: number;
  client: string;
  domaine: string;
  besoin: string;
  type: string;
  statut: string;
  dateContact: string;
  montantEstime?: number;
  priorite: string;
}

@Component({
  selector: 'app-modifier-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modifier.html',
  styleUrls: ['./modifier.css']
})
export class ModifierComponent implements OnInit {

  form: FormGroup;
  successMessage: string = '';
  idRecu: number = 0;

  // Simule une donnée venant du backend
  prospectionExistante: Prospection = {
    idProspection: 1,
    client: 'Entreprise ABC',
    domaine: 'Tech',
    besoin: 'Développement d\'une application mobile',
    type: 'contrat',
    statut: 'en_cours',
    dateContact: '2025-11-28',
    montantEstime: 5000,
    priorite: 'moyenne'
  };

  typesProspection = [
    { value: 'contrat', label: 'Contrat' },
    { value: 'appelOffre', label: 'Appel d\'offre' }
  ];

  statuts = [
    { value: 'en_cours', label: 'En cours' },
    { value: 'gagne', label: 'Gagné' },
    { value: 'perdu', label: 'Perdu' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      client: ['', [Validators.required, Validators.minLength(2)]],
      domaine: ['', Validators.required],
      besoin: ['', [Validators.required, Validators.minLength(10)]],
      type: ['', Validators.required],
      statut: ['', Validators.required],
      dateContact: ['', Validators.required],
      montantEstime: [''],
      priorite: ['moyenne']
    });
  }

  ngOnInit(): void {
    // Récupération de l'ID dans l'URL
    this.idRecu = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID reçu depuis la route =', this.idRecu);

    
    this.form.patchValue({
      client: this.prospectionExistante.client,
      domaine: this.prospectionExistante.domaine,
      besoin: this.prospectionExistante.besoin,
      type: this.prospectionExistante.type,
      statut: this.prospectionExistante.statut,
      dateContact: this.prospectionExistante.dateContact,
      montantEstime: this.prospectionExistante.montantEstime,
      priorite: this.prospectionExistante.priorite
    });
  }

  // Vérifie les erreurs de validation
  hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  // Bouton Annuler
  goBack(): void {
    this.form.reset(this.prospectionExistante);
  }

  // Soumission du formulaire
  update(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updatedProspection: Prospection = {
      ...this.prospectionExistante,
      ...this.form.value
    };

    this.prospectionExistante = updatedProspection;
    this.successMessage = '✓ Prospection modifiée avec succès !';

    console.log('Prospection mise à jour :', this.prospectionExistante);
  }
}
