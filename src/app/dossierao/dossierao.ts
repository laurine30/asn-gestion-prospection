import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dossier, DossierAoService } from '../services/dossier-ao-service';
import { AppelOffreService } from '../services/appel-offre-service';

interface AppelOffre {
  idAo?: number;
  titre: string;
  datePublic: string;
  dateRponse?: string;
  statut?: string;
}

@Component({
  selector: 'app-dossier',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dossierao.html',
  styleUrls: ['./dossierao.css']
})
export class DossierComponent implements OnInit {

  dossier: Dossier = {
    referenceAo: '',
    intituleAo: ''
  };

  appelsOffres: AppelOffre[] = [];
  message: string = '';
  selectedFiles: File[] = [];

  constructor(
    private dossierService: DossierAoService,
    private appelOffreService: AppelOffreService
  ) { }

  ngOnInit(): void {
    this.loadAppelsOffres();
  }

  // Charger la liste des appels d'offres
  loadAppelsOffres() {
    this.appelOffreService.getAll().subscribe({
      next: (data) => {
        this.appelsOffres = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des AO:', err);
        this.message = 'Erreur lors du chargement des appels d\'offres';
      }
    });
  }

  // Quand un AO est sélectionné, remplir automatiquement l'intitulé
  onAppelOffreChange(event: any) {
    const selectedId = event.target.value;
    const selectedAo = this.appelsOffres.find(ao => ao.idAo?.toString() === selectedId);
    
    if (selectedAo) {
      this.dossier.intituleAo = selectedAo.titre;
      this.dossier.referenceAo = selectedId;
    }
  }

  // Gestion des fichiers
  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      console.log("Fichiers sélectionnés :", this.selectedFiles);
    }
  }

  // Soumettre le formulaire
  onSubmit() {
    if (!this.dossier.referenceAo) {
      this.message = 'Veuillez sélectionner un appel d\'offre';
      return;
    }

    this.dossierService.create(this.dossier).subscribe({
      next: (res) => {
        this.message = 'Dossier créé avec succès !';
        
        // Réinitialiser le formulaire
        this.dossier = { referenceAo: '', intituleAo: '' };
        this.selectedFiles = [];
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: (err) => {
        this.message = 'Erreur lors de la création du dossier';
        console.error(err);
      }
    });
  }
}