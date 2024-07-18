import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreService } from '../../../services/core.service';
import { SearchHomeComponent } from '../../shared/search-home/search-home.component';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { BannerVenderHomeComponent } from '../../shared/banner-vender-home/banner-vender-home.component';
import { SlidesComponent } from '../../shared/slides/slides.component';
import { IConfigSlides } from '../../../models/configslides';
import { ESlides } from '../../../enums/slides';
import { BannerPrincipalComponent } from '../../shared/banner-principal/banner-principal.component';
import { IMenu } from '../../../models/menu';
import { EMeta } from '../../../enums/meta';
import { SlidesUltimosComponent } from '../../shared/slides-ultimos/slides-ultimos.component';

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
    BannerPrincipalComponent,
    SlidesUltimosComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  form = this.fb.group({
    tipo: ['apartamento'],
    categoria: ['comprar'],
    termo: ['']
  });

  slidesConfig: IConfigSlides[] = [
    {titulo: 'Casas', subtitulo: 'Em Condominios, Soltas, Alto padrão, Vila...', tipo: ESlides.casa, start: 0, end: 10},
    {titulo: 'Empreendimentos', subtitulo: 'Lojas, Salas, Escritórios, Galpões, Sitios, Fazendas...', tipo: ESlides.comercial, start: 0, end: 10},
    {titulo: 'Apartamentos', subtitulo: 'Padrão, Duplex, Garden e Loft...', tipo: ESlides.apartamento,  start: 0, end: 10},
  ]

  empresaMenu: IMenu[] = [
    {
      title: 'Quem sou',
      iconlabel: 'icon face',
      icon: 'face_4',
      url: '/quem-sou',
      target: '_self'
    },
    {
      title: 'Whatsapp',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://api.whatsapp.com/send?phone=5598970278027&text=Estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20telmamonteiro.com.br%20e%20gostaria%20de%20solicitar%20atendimento.',
      target: '_blank'
    },    
    {
      title: 'Instagram',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.instagram.com/telmamonteirodematos?igsh=MTl0ZXoycmY2YTNvYQ==',
      target: '_blank'
    },    {
      title: 'Facebook',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.facebook.com/telma.monteiro.79?mibextid=ZbWKwL',
      target: '_blank'
    },
  ]

  constructor(
    private fb: FormBuilder,
    public core: CoreService,
  ){}

  ngOnInit(): void {
    this.core.setTitle('Telma Monteiro - Corretora de Imóveis no Maranhão');
    this.core.updateMeta(EMeta.DESC_HOME, EMeta.KEY_SOU);
  }


  getUrl(url: string) {
    return `url(${url})`;
  }

}
