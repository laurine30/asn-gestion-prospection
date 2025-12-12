import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  // Données statiques pour les statistiques
  stats = [
    { title: 'Prospections', value: 45, color: '#78556f' },
    { title: 'Appels d\'offres', value: 23, color: '#9b7a91' },
    { title: 'Dossiers en cours', value: 12, color: '#a7869eff' }
  ];

  // Données pour le tableau des appels d'offres récents
  recentAO = [
    { id: 'AO-001', titre: 'Développement application mobile', client: 'SONABEL', statut: 'En cours', date: '15/11/2024' },
    { id: 'AO-002', titre: 'Infrastructure réseau', client: 'ONEA', statut: 'Validé', date: '10/11/2024' },
    { id: 'AO-003', titre: 'Système de gestion', client: 'BUMIGEB', statut: 'En attente', date: '08/11/2024' },
    { id: 'AO-004', titre: 'Site web institutionnel', client: 'Ministère Santé', statut: 'En cours', date: '05/11/2024' },
    { id: 'AO-005', titre: 'Plateforme e-learning', client: 'MENA', statut: 'Validé', date: '01/11/2024' }
  ];

  getStatutColor(statut: string): string {
    switch(statut) {
      case 'En cours': return '#ffa726';
      case 'Validé': return '#66bb6a';
      case 'En attente': return '#42a5f5';
      case 'Rejeté': return '#ef5350';
      default: return '#78556f';
    }
  }
}
