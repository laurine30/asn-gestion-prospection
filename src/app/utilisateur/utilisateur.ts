import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Utilisateur, UtilisateurService } from '../services/utilisateur-service';
import { RoleService, Role } from '../services/role-service';

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule], 
  templateUrl: './utilisateur.html',
  styleUrls: ['./utilisateur.css']
})
export class UtilisateurComponent implements OnInit {

  roles: Role[] = [];

  utilisateur: Utilisateur = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: null!,  
    userUpdate: ''
  };

  message = '';
  
  @ViewChild('userForm') userForm!: NgForm;

  constructor(
    private utilisateurService: UtilisateurService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: data => {
        console.log('Rôles récupérés:', data); 
        this.roles = data;
      },
      error: err => console.error('Erreur chargement rôles:', err)
    });
  }

  onSubmit() {
    if (!this.utilisateur.role) {
      this.message = 'Veuillez sélectionner un rôle';
      return;
    }

    if (!this.userForm.valid) {
      this.message = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.utilisateurService.createUtilisateur(this.utilisateur).subscribe({
      next: data => {
        this.message = 'Utilisateur créé avec succès !';
       
        // Réinitialiser l'objet utilisateur
        this.utilisateur = {
          nom: '',
          prenom: '',
          email: '',
          motDePasse: '',
          role: null!,
          userUpdate: ''
        };
        
        // Réinitialiser le formulaire
        if (this.userForm) {
          this.userForm.reset();
          this.userForm.control.markAsPristine();
          this.userForm.control.markAsUntouched();
          
          // Réinitialiser le sélecteur de rôle
          setTimeout(() => {
            const roleSelect = document.getElementById('role') as HTMLSelectElement;
            if (roleSelect) {
              roleSelect.selectedIndex = 0;
            }
          }, 0);
        }
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: err => {
        this.message = 'Erreur lors de la création : ' + (err.error?.message || err.message);
        console.error('Erreur:', err);
      }
    });
  }
}