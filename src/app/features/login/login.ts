import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],   // 
})
export class Login {
  email: string = '';
  password: string = '';
  message: string = '';
  messageType: string = '';

  constructor(private router: Router) {}

  handleConnexion(): void {
    if (!this.email || !this.password) {
      this.showMessage('Veuillez remplir tous les champs', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showMessage("Format d'email invalide", 'error');
      return;
    }

    this.showMessage('Connexion réussie !', 'success');
    console.log('Email:', this.email);
  }

  showMessage(text: string, type: string): void {
    this.message = text;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }

  forgotPassword(): void {
    this.showMessage('Fonctionnalité "Mot de passe oublié" à implémenter. Contactez le support.', 'info');
  }
}
