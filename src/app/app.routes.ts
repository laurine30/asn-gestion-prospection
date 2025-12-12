import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Template } from './template/template';
import { DashboardComponent } from './features/dashboard/dashboard';
import { ValidateProspectionComponent } from './valider/valider';
import { ModifierComponent } from './modifier/modifier';
import { Listprospect } from './listprospect/listprospect';
import { DossierComponent } from './dossierao/dossierao';
import { UtilisateurComponent } from './utilisateur/utilisateur';
import { RoleComponent } from './role/role';
import { ProspectionComponent } from './prospection/prospection';
import { ListClientComponent } from './liste-client/liste-client';
import { ClientFormComponent } from './client/client';
import { ListAoComponent } from './listao/listao';
import { ContratListComponent } from './contratlist/contratlist';
import { FactureComponent } from './facture/facture';
import { ListUtilisateurComponent } from './utilisateurlist/utilisateurlist';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Template,
    children: [
      { path: '', component: DashboardComponent }, 

      { path: 'dashboard', component: DashboardComponent },

      { path: 'valider-prospection', component: ValidateProspectionComponent },

      { path: 'modifier-prospection/:id', component: ModifierComponent },

      { path: 'liste-prospections', component: Listprospect },

      { path: 'dossier-ao', component: DossierComponent},

      { path: 'utilisateur', component: UtilisateurComponent},

      { path: 'role', component: RoleComponent},

      { path: 'createClient', component: ClientFormComponent},

      { path: 'enregistrer-ao', component: ListAoComponent},

      { path: 'createAppelOffre', component: ListAoComponent},

      { path: 'appels-offre', component: ListAoComponent },
      
      { path: 'createAppelOffre', component: ListAoComponent },

       { path: 'contratlist', component: ContratListComponent },

         { path: 'facture', component:FactureComponent },

          { path: 'utilisateur', component:UtilisateurComponent },

         
    ]
  }
];