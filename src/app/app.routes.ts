import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Template } from './template/template';
import { DashboardComponent } from './features/dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '', 
    component: Template,
    children: [
      { path: '', component: DashboardComponent }, // Dashboard par défaut
      { path: 'dashboard', component: DashboardComponent }
    ]
  }
];
