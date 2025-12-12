import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Client, ClientService } from '../services/client-service';
import { Prospection, ProspectionService } from '../services/prospection-service';

@Component({
  selector: 'app-prospection', // SELECTEUR IMPORTANT
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './prospection.html',
  styleUrls: ['./prospection.css']
})
export class ProspectionComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() prospectionCreated = new EventEmitter<void>();
  
  form: FormGroup;
  submitted = false;
  successMessage = '';
  showForm = false; // À SUPPRIMER car c'est le parent qui contrôle

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
    private fb: FormBuilder,
    private clientService: ClientService,
    private prospectionService: ProspectionService
  ) {
    this.form = this.fb.group({
      id_client: [null, Validators.required],
      domaine: ['', Validators.required],
      besoin: ['', [Validators.required, Validators.minLength(10)]],
      type: ['', Validators.required],
      statut: ['En cours', Validators.required],
      dateContact: ['', Validators.required],
      montantEstime: [''],
      priorite: ['moyenne', Validators.required]
    });
  }

  ngOnInit() {
    this.clientService.getClientsList().subscribe({
      next: (clients) => this.clients = clients,
      error: (err) => console.error('Erreur récupération clients :', err)
    });
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) return;

    const clientId = Number(this.form.value.id_client);
    const client = this.clients.find(c => c.idClient === clientId);
    if (!client) {
      alert('Client introuvable');
      return;
    }

    const nouvelleProspection: Prospection = {
      client: client,
      domaine: this.form.value.domaine,
      besoin: this.form.value.besoin,
      type: this.form.value.type,
      statut: this.form.value.statut,
      dateContact: this.form.value.dateContact,
      montantEstime: this.form.value.montantEstime ? Number(this.form.value.montantEstime) : undefined
    };

    this.prospectionService.createProspection(nouvelleProspection).subscribe({
      next: (savedProspection) => {
        this.successMessage = 'Prospection enregistrée avec succès !';
        
        // Émet l'événement pour informer le parent
        this.prospectionCreated.emit();
        
        // Ferme après 1.5 secondes
        setTimeout(() => {
          this.closeForm();
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur lors de la sauvegarde :', err);
        alert('Impossible de créer la prospection. Vérifiez le serveur.');
      }
    });
  }

  closeForm() {
    this.close.emit(); // Informe le parent de fermer
    this.resetForm();
  }

  resetForm() {
    this.submitted = false;
    this.successMessage = '';
    this.form.reset({
      id_client: null,
      statut: 'En cours',
      priorite: 'moyenne'
    });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }
}