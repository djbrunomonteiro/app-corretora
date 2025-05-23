import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { SearchHomeComponent } from '../search-home/search-home.component';
import { StoreService } from '../../../services/store.service';
import { UltimosAnuncios } from '../../../store/selectors/anuncio.selector';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SwiperOptions } from 'swiper/types';
import { LeadService } from '../../../services/lead.service';


@Component({
    selector: 'app-slides-home',
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
    templateUrl: './slides-home.component.html',
    styleUrl: './slides-home.component.scss'
})
export class SlidesHomeComponent implements OnInit {

  leadService = inject(LeadService);

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
    640: {
      slidesPerView: 4,
      spaceBetween: 10,
      

    }
  };



  slides1: any[] = [];
  slides2: any[] = [];

  constructor(private storeService: StoreService) { }
  ngOnInit(): void {
    this.leadService.checkCollectedContact();
    this.storeService.select(UltimosAnuncios(0, 5)).subscribe(res => {
      this.slides1 = res;
    });
  }

}
