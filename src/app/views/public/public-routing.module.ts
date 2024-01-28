import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PublicComponent } from './public.component';
import { SearchComponent } from './search/search.component';
import { AnuncioDetailsComponent } from './details/anuncio-details.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        
      },
      {
        path: 'buscar',
        loadComponent: () => SearchComponent
      },     
      {
        path: 'anuncios/:url',
        loadComponent: () => AnuncioDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
