import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ← AJOUT IMPORTANT
import { FormsModule } from '@angular/forms';
import { RoleService } from '../services/role-service';

export interface Role {  
  libRole: string;
  userUpdate: string;
}

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, FormsModule], // ← CommonModule ajouté ici
  templateUrl: './role.html',
  styleUrls: ['./role.css'] // ← Ajoutez votre fichier CSS
})
export class RoleComponent {
  role: Role = { libRole: '', userUpdate: '' };
  message = '';

  constructor(private roleService: RoleService) {}

  onSubmit() {
    this.roleService.createRole(this.role).subscribe({
      next: data => {
        this.message = 'Rôle créé avec succès !';
        // Réinitialiser le formulaire après succès
        this.role = { libRole: '', userUpdate: '' };
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: err => {
        this.message = 'Erreur lors de la création du rôle : ' + err.error;
      }
    });
  }
}