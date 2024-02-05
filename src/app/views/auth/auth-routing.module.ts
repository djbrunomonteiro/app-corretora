import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin/login/login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AuthComponent } from './auth.component';
import { AdminAnunciosComponent } from './admin/anuncios/list/admin-anuncios.component';
import { AdminLeadsComponent } from './admin/admin-leads/admin-leads.component';
import { AdminClientesComponent } from './admin/admin-clientes/admin-clientes.component';
import { AdminClientesListComponent } from './admin/clientes/admin-clientes-list/admin-clientes-list.component';
import { AdminClientesEditComponent } from './admin/clientes/admin-clientes-edit/admin-clientes-edit.component';
import { ClienteHomeComponent } from './cliente/cliente-home/cliente-home.component';

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
        loadComponent: () => AdminClientesListComponent,
      },
      {
        path: 'clientes/edit',
        loadComponent: () => AdminClientesEditComponent,
      },
      {
        path: 'clientes/edit/:id',
        loadComponent: () => AdminClientesEditComponent,
      }
    ]
    
  },
  {
    path: 'cliente',
    component: AuthComponent,
    children: [
      {
        path: '',
        loadComponent: () => ClienteHomeComponent,
      },
      {
        path: ':id',
        loadComponent: () => ClienteHomeComponent,
      },
    ]
    
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
