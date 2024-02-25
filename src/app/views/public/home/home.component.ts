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
    BannerVenderHomeComponent
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
    {titulo: 'Apartamentos', tipo: ESlides.apartamento, start: 0, end: 10},
    {titulo: 'Casas', tipo: ESlides.casa, start: 0, end: 10},
    {titulo: 'Empreendimentos Comerciais', tipo: ESlides.comercial, start: 0, end: 10},
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
