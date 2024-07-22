import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PublicComponent } from './public.component';
import { SearchComponent } from './search/search.component';
import { AnuncioDetailsComponent } from './details/anuncio-details.component';
import { QuemSouComponent } from './quem-sou/quem-sou.component';
import { ParceirosComponent } from './parceiros/parceiros.component';
import { DepoimentosComponent } from './depoimentos/depoimentos.component';
import { PoliticaPrivacidadeComponent } from './politica-privacidade/politica-privacidade.component';
import { ContatosComponent } from './contatos/contatos.component';
import { LinksComponent } from './links/links.component';
import { PostDetailsComponent } from './post-details/post-details.component';

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
        path: 'links',
        component: LinksComponent,
      },
      {
        path: 'buscar',
        loadComponent: () => SearchComponent
      },     
      {
        path: 'anuncios/:url',
        loadComponent: () => AnuncioDetailsComponent
      },
      {
        path: 'quem-sou',
        loadComponent: () => QuemSouComponent
      },
      {
        path: 'contatos',
        loadComponent: () => ContatosComponent
      },
      {
        path: 'parceiros',
        loadComponent: () => ParceirosComponent
      },
      {
        path: 'depoimentos',
        loadComponent: () => DepoimentosComponent
      },
      {
        path: 'blog/post/:url',
        loadComponent: () => PostDetailsComponent
      },
      {
        path: 'politica-de-privacidade',
        loadComponent: () => PoliticaPrivacidadeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
