import { Injectable } from '@angular/core';

// Type pour les rôles de l'authentification
export type RoleType = 'COMMERCIAL' | 'CHEF_DEPARTEMENT' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private role: RoleType = null;

  constructor() {}

  setRole(role: Exclude<RoleType, null>) {
    this.role = role;
  }

  hasRole(role: Exclude<RoleType, null>): boolean {
    return this.role === role;
  }

  getRole(): RoleType {
    return this.role;
  }

  canModify(): boolean {
    return this.role === 'COMMERCIAL' || this.role === 'CHEF_DEPARTEMENT';
  }

  canValidate(): boolean {
    return this.role === 'CHEF_DEPARTEMENT';
  }
}