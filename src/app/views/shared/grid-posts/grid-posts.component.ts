import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { MaterialModule } from '../../../modules/material/material.module';
import { BlogStore } from '../../../store/blog-store';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-grid-posts',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    UrlFotosPipe,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './grid-posts.component.html',
  styleUrl: './grid-posts.component.scss'
})
export class GridPostsComponent implements OnInit {


  blogStore = inject(BlogStore)

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
      slidesPerView: 2,
      spaceBetween: 10,
    },
    800: {
      slidesPerView: 5,
      spaceBetween: 10,
    },
  };

  ngOnInit(): void {
    console.log(this.blogStore.allItens());
    
   
  }



}
