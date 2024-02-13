import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { SearchHomeComponent } from '../search-home/search-home.component';

@Component({
  selector: 'app-slides-home',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    SearchHomeComponent,
    UrlFotosPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slides-home.component.html',
  styleUrl: './slides-home.component.scss'
})
export class SlidesHomeComponent {

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

}
