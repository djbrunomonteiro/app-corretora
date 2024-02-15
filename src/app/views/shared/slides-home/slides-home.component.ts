import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { SearchHomeComponent } from '../search-home/search-home.component';
import { StoreService } from '../../../services/store.service';
import { UltimosAnuncios } from '../../../store/selectors/anuncio.selector';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-slides-home',
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
  templateUrl: './slides-home.component.html',
  styleUrl: './slides-home.component.scss'
})
export class SlidesHomeComponent implements OnInit {

  cards = [
    'https://lh3.googleusercontent.com/neYXGptDhUp7FdKhugzdsW19TbJ_MYRGd5p9nhUMTpZ294blh6eke8TGioOSFF5_LIsxgKA5RG8GWKzeVewyjXb2wrb9dlfECegqoXEImg=s0',
    'https://lh3.googleusercontent.com/BLUv8K8PVW-E5XPTI8MqUO_X9v_f5uzVjAVWuu-W3OOXtLneoLh2ZfCfq-yygq63kJVRMO99P_7sFniZPo2Z7FLW5nvSEixuv9bLC42R=s0',
    'https://lh3.googleusercontent.com/neYXGptDhUp7FdKhugzdsW19TbJ_MYRGd5p9nhUMTpZ294blh6eke8TGioOSFF5_LIsxgKA5RG8GWKzeVewyjXb2wrb9dlfECegqoXEImg=s0',
    'https://lh3.googleusercontent.com/neYXGptDhUp7FdKhugzdsW19TbJ_MYRGd5p9nhUMTpZ294blh6eke8TGioOSFF5_LIsxgKA5RG8GWKzeVewyjXb2wrb9dlfECegqoXEImg=s0',
    'https://lh3.googleusercontent.com/neYXGptDhUp7FdKhugzdsW19TbJ_MYRGd5p9nhUMTpZ294blh6eke8TGioOSFF5_LIsxgKA5RG8GWKzeVewyjXb2wrb9dlfECegqoXEImg=s0',
  ];

  breakpoints = {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 10
    }
  };

  slides1:any[] = [];
  slides2:any[] = [];

  constructor(private storeService: StoreService){}
  ngOnInit(): void {
    this.storeService.select(UltimosAnuncios(0, 3)).subscribe(res => {
      this.slides1 = res;
      console.log(this.slides1);
      
    } );
    this.storeService.select(UltimosAnuncios(3, 5)).subscribe(res => {
      this.slides2 = res;
      console.log(this.slides2);
      
    } );
  }

}
