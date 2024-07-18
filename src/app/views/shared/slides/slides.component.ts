import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  Signal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SwiperOptions } from 'swiper/types';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { SearchHomeComponent } from '../search-home/search-home.component';
import { StoreService } from '../../../services/store.service';
import { IConfigSlides } from '../../../models/configslides';
import { NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AnunciosStore } from '../../../store/anuncios-store';

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
  styleUrl: './slides.component.scss',
})
export class SlidesComponent {
  @Input() slidesConfig!: IConfigSlides;

  private readonly store = inject(Store);

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
      slidesPerView: 4,
      spaceBetween: 10,
    },
  };

  slides!: Signal<any[]>;

  anunciosStore = inject(AnunciosStore);

  countSLider = signal(3);

  constructor(private storeService: StoreService, private router: Router) {
    effect(() => this.setItensSlides())
  }

  ngOnInit(): void {
    this.setItensSlides();
  }

  setItensSlides() {
    if (!this.slidesConfig) {
      return;
    }

    this.slides = this.anunciosStore.selectItensSlider(
      this.slidesConfig.tipo,
      this.slidesConfig.start,
      this.slidesConfig.end
    );

    // this.slidesSignal = this.store.selectSignal(anunciosSlides(this.slidesConfig.tipo, this.slidesConfig.start, this.slidesConfig.end))

    // this.storeService.select(anunciosSlides(this.slidesConfig.tipo, this.slidesConfig.start, this.slidesConfig.end)).subscribe(res => this.slides = res);
    if (!this.slidesConfig.breakpoints) {
      return;
    }
    this.breakpoints = this.slidesConfig.breakpoints;
  }

  openAnuncio(url: string) {
    this.router.navigate([`/anuncios/${url}`]);
  }

  openMais() {
    const queryParams = {
      termo: String(this.slidesConfig.tipo).toLowerCase(),
    } as NavigationExtras;
    this.router.navigate(['buscar'], { queryParams });
  }
}
