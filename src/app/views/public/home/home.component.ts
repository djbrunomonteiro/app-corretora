import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../../../services/core.service';
import { Router } from '@angular/router';
import { SearchHomeComponent } from '../../shared/search-home/search-home.component';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { BannerVenderHomeComponent } from '../../shared/banner-vender-home/banner-vender-home.component';
import { SlidesComponent } from '../../shared/slides/slides.component';
import { IConfigSlides } from '../../../models/configslides';
import { ESlides } from '../../../enums/slides';
import { BannerPrincipalComponent } from '../../shared/banner-principal/banner-principal.component';
import { IMenu } from '../../../models/menu';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    SearchHomeComponent,
    UrlFotosPipe,
    SlidesComponent,
    BannerVenderHomeComponent,
    BannerPrincipalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  form = this.fb.group({
    tipo: ['apartamento'],
    categoria: ['comprar'],
    termo: ['']
  });

  slidesConfig: IConfigSlides[] = [
    {titulo: 'Apartamentos', subtitulo: 'Padrão, Duplex, Garden e Loft...', tipo: ESlides.apartamento,  start: 0, end: 10},
    {titulo: 'Casas', subtitulo: 'Em Condominios, Soltas, Alto padrão, Vila...', tipo: ESlides.casa, start: 0, end: 10},
    {titulo: 'Empreendimentos Comerciais', subtitulo: 'Lojas, Salas, Escritórios, Galpões...', tipo: ESlides.comercial, start: 0, end: 10},
  ]

  empresaMenu: IMenu[] = [
    {
      title: 'Quem sou',
      iconlabel: 'icon face',
      icon: 'face_4',
      url: 'quem-sou'
    },
    {
      title: 'Whatsapp',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'contatos'
    },    
    {
      title: 'Instagram',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'contatos'
    },    {
      title: 'Facebook',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'contatos'
    },


  ]


  constructor(
    private fb: FormBuilder,
    public core: CoreService,
    private router: Router,
  ){}


  getUrl(url: string) {
    return `url(${url})`;
  }


}
