import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Contrat {
  idContrat: number;
  montantContrat: number;
}

interface Facture {
  idFacture: number;
  num: number;
  dateEmition: string;
  dateEcheance: string;
  statut: string;
  etatPaie: number;
  tauxTva: number;
  mentionLegale: string;
  contrat: Contrat;
}

interface Filters {
  statut: string;
  dateDebut: string;
  dateFin: string;
  montantMin: string;
  montantMax: string;
}

@Component({
  selector: 'app-facture',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './facture.html',
  styleUrls: ['./facture.css']
})
export class FactureComponent implements OnInit {
  factures: Facture[] = [];
  filteredFactures: Facture[] = [];
  showModal: boolean = false;

  filters: Filters = {
    statut: '',
    dateDebut: '',
    dateFin: '',
    montantMin: '',
    montantMax: ''
  };

  // Formulaire réactif uniquement
  factureForm = new FormGroup({
    num: new FormControl('', [Validators.required, Validators.min(1)]),
    dateEmition: new FormControl('', [Validators.required]),
    dateEcheance: new FormControl('', [Validators.required]),
    tauxTva: new FormControl(18, [Validators.required, Validators.min(0), Validators.max(100)]),
    mentionLegale: new FormControl('Paiement sous 30 jours', [Validators.required]),
    idContrat: new FormControl('', [Validators.required, Validators.min(1)])
  });

  // Pour la recherche globale
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(): void {
    // Données de démonstration
    this.factures = [
      {
        idFacture: 1,
        num: 1001,
        dateEmition: '2024-01-15',
        dateEcheance: '2024-02-15',
        statut: 'EN_ATTENTE',
        etatPaie: 0,
        tauxTva: 18,
        mentionLegale: 'Paiement sous 30 jours',
        contrat: { idContrat: 1, montantContrat: 5000 }
      },
      {
        idFacture: 2,
        num: 1002,
        dateEmition: '2024-02-01',
        dateEcheance: '2024-03-01',
        statut: 'PARTIELLEMENT_PAYEE',
        etatPaie: 50,
        tauxTva: 18,
        mentionLegale: 'Paiement sous 30 jours',
        contrat: { idContrat: 2, montantContrat: 8000 }
      },
      {
        idFacture: 3,
        num: 1003,
        dateEmition: '2024-03-10',
        dateEcheance: '2024-04-10',
        statut: 'PAYEE',
        etatPaie: 100,
        tauxTva: 18,
        mentionLegale: 'Paiement sous 30 jours',
        contrat: { idContrat: 3, montantContrat: 12000 }
      },
      {
        idFacture: 4,
        num: 1004,
        dateEmition: '2023-12-01',
        dateEcheance: '2024-01-01',
        statut: 'EN_RETARD',
        etatPaie: 0,
        tauxTva: 18,
        mentionLegale: 'Paiement sous 30 jours',
        contrat: { idContrat: 4, montantContrat: 6000 }
      }
    ];
    this.filteredFactures = [...this.factures];
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'PAYEE':
        return 'bg-green-100 text-green-800';
      case 'PARTIELLEMENT_PAYEE':
        return 'bg-blue-100 text-blue-800';
      case 'EN_RETARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }

  getStatutIcon(statut: string): string {
    switch (statut) {
      case 'PAYEE':
        return '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
      case 'PARTIELLEMENT_PAYEE':
      case 'EN_ATTENTE':
        return '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
      case 'EN_RETARD':
        return '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
      default:
        return '';
    }
  }

  getStatutText(statut: string): string {
    switch (statut) {
      case 'PAYEE':
        return 'Payée';
      case 'PARTIELLEMENT_PAYEE':
        return 'Partiellement payée';
      case 'EN_RETARD':
        return 'En retard';
      default:
        return 'En attente';
    }
  }

  calculateMontantTTC(montantHT: number, tauxTva: number): number {
    return montantHT * (1 + tauxTva / 100);
  }

  // Méthode pour la recherche globale
  applyFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.factures];

    // Filtre par recherche globale
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(facture => {
        return facture.num.toString().includes(searchTermLower) ||
               this.getStatutText(facture.statut).toLowerCase().includes(searchTermLower);
      });
    }

    // Applique les autres filtres
    this.filteredFactures = filtered.filter(facture => {
      const montantTTC = this.calculateMontantTTC(
        facture.contrat.montantContrat,
        facture.tauxTva
      );

      // Filtre par statut
      if (this.filters.statut && facture.statut !== this.filters.statut) {
        return false;
      }

      // Filtre par date de début
      if (this.filters.dateDebut && facture.dateEmition < this.filters.dateDebut) {
        return false;
      }

      // Filtre par date de fin
      if (this.filters.dateFin && facture.dateEmition > this.filters.dateFin) {
        return false;
      }

      // Filtre par montant minimum
      if (this.filters.montantMin && 
          montantTTC < parseFloat(this.filters.montantMin)) {
        return false;
      }

      // Filtre par montant maximum
      if (this.filters.montantMax && 
          montantTTC > parseFloat(this.filters.montantMax)) {
        return false;
      }

      return true;
    });
  }

  resetFilters(): void {
    this.filters = {
      statut: '',
      dateDebut: '',
      dateFin: '',
      montantMin: '',
      montantMax: ''
    };
    this.searchTerm = '';
    this.filteredFactures = [...this.factures];
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.factureForm.reset({
      tauxTva: 18,
      mentionLegale: 'Paiement sous 30 jours'
    });
  }

  submitForm(): void {
    if (this.factureForm.valid) {
      const formValue = this.factureForm.value;
      
      const newFacture: Facture = {
        idFacture: this.factures.length + 1,
        num: parseInt(formValue.num || '0'),
        dateEmition: formValue.dateEmition || '',
        dateEcheance: formValue.dateEcheance || '',
        statut: 'EN_ATTENTE',
        etatPaie: 0,
        tauxTva: formValue.tauxTva || 18,
        mentionLegale: formValue.mentionLegale || '',
        contrat: {
          idContrat: parseInt(formValue.idContrat || '0'),
          montantContrat: 5000 // À récupérer du contrat réel
        }
      };

      this.factures.push(newFacture);
      this.applyFilters();
      this.closeModal();
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.factureForm.markAllAsTouched();
      alert('Veuillez corriger les erreurs dans le formulaire');
    }
  }

  exportFacture(facture: Facture): void {
    const montantTTC = this.calculateMontantTTC(
      facture.contrat.montantContrat,
      facture.tauxTva
    );

    const exportData = {
      numero: facture.num,
      dateEmission: facture.dateEmition,
      dateEcheance: facture.dateEcheance,
      statut: this.getStatutText(facture.statut),
      montantHT: facture.contrat.montantContrat,
      tauxTVA: facture.tauxTva + '%',
      montantTTC: montantTTC.toFixed(2) + ' FCFA',
      etatPaiement: facture.etatPaie + '%',
      mentionLegale: facture.mentionLegale
    };

    // Créer et télécharger le fichier JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture_${facture.num}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}