import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SwiperOptions } from 'swiper/types';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { SearchHomeComponent } from '../search-home/search-home.component';
import { StoreService } from '../../../services/store.service';
import { UltimosAnuncios, anunciosSlides } from '../../../store/selectors/anuncio.selector';
import { ESlides } from '../../../enums/slides';
import { IConfigSlides } from '../../../models/configslides';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-slides',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchHomeComponent,
    UrlFotosPipe,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slides.component.html',
  styleUrl: './slides.component.scss'
})
export class SlidesComponent {

  @Input() slidesConfig!: IConfigSlides;

  
  breakpoints: SwiperOptions['breakpoints'] = {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 5,
      slidesOffsetAfter: 0.2,
      slidesOffsetBefore:0.5

    },
    // when window width is >= 480px
    480: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // when window width is >= 640px
    768: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    800: {
      slidesPerView: 4,
      spaceBetween: 10,
    }
  };

  slides: any[] = [];


  constructor(
    private storeService: StoreService,
    private router: Router
    ) { }
  ngOnInit(): void {
    this.setItensSlides()
  }

  setItensSlides(){
    if(!this.slidesConfig){return;}
    this.storeService.select(anunciosSlides(this.slidesConfig.tipo, this.slidesConfig.start, this.slidesConfig.end)).subscribe(res => this.slides = res);
    if(!this.slidesConfig.breakpoints){return;}
    this.breakpoints = this.slidesConfig.breakpoints;

  }

  openAnuncio(url: string){
    this.router.navigate([`/anuncios/${url}`])
  }

  openMais(){
    const queryParams = { termo: String(this.slidesConfig.tipo).toLowerCase() } as NavigationExtras
    this.router.navigate(['buscar'], {queryParams} )
    
  }

}
