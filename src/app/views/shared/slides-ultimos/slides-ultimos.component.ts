import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AnunciosStore } from '../../../store/anuncios-store';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { SwiperOptions } from 'swiper/types';
import { Router } from '@angular/router';
import { LeadService } from '../../../services/lead.service';

@Component({
  selector: 'app-slides-ultimos',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    UrlFotosPipe,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slides-ultimos.component.html',
  styleUrl: './slides-ultimos.component.scss'
})
export class SlidesUltimosComponent {

  anunciosStore = inject(AnunciosStore);
  router = inject(Router);
  leadService = inject(LeadService);

  breakpoints: SwiperOptions['breakpoints'] = {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 5,
      slidesOffsetAfter: 0.2,
      slidesOffsetBefore: 0.5,
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
      slidesPerView: 3,
      spaceBetween: 10,
      grid: {
        rows: 2,
        fill: 'row'
      }
    },
  };

  ngOnInit(): void {
    this.leadService.checkCollectedContact()
  }

  openAnuncio(url: string | undefined) {
    this.router.navigate([`/anuncios/${url}`]);
  }



}


