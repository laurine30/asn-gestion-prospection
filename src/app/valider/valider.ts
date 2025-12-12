import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-valider-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './valider.html',
  styleUrls: ['./valider.css']
})
export class ValidateProspectionComponent {

  message: string | null = null;
  form: FormGroup;  // ← Déclare juste le type ici

  constructor(private fb: FormBuilder) {
    // ← Initialise le formulaire ici, après que fb soit disponible
    this.form = this.fb.group({
      idProspection: ['', Validators.required],
      statut: ['Validée', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.message = "Veuillez remplir tous les champs";
      return;
    }
    
    console.log('Données du formulaire:', this.form.value);
    this.message = `Prospection ${this.form.value.idProspection} validée avec succès !`;
  }

  reset() {
    this.form.reset({ statut: 'Validée' });
    this.message = null;
  }
}