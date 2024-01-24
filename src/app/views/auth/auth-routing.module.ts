import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/login/login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AuthComponent } from './auth.component';
import { AdminAnunciosComponent } from './admin/admin-anuncios/admin-anuncios.component';
import { AdminLeadsComponent } from './admin/admin-leads/admin-leads.component';
import { AdminClientesComponent } from './admin/admin-clientes/admin-clientes.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadComponent: () => AdminLoginComponent,
      },
      {
        path: 'home',
        loadComponent: () => AdminHomeComponent,
      },      
      {
        path: 'leads',
        loadComponent: () => AdminLeadsComponent,
      },
      {
        path: 'anuncios',
        loadComponent: () => AdminAnunciosComponent,
      },
      {
        path: 'clientes',
        loadComponent: () => AdminClientesComponent,
      }
    ]
    
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
