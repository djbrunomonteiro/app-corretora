import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchComponent } from '../../public/search/search.component';
import { SearchHomeComponent } from '../search-home/search-home.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-banner-principal',
    imports: [
        CommonModule,
        SearchHomeComponent,
        MatIconModule
    ],
    templateUrl: './banner-principal.component.html',
    styleUrl: './banner-principal.component.scss'
})
export class BannerPrincipalComponent {

  // imageUrl = 'https://pixelprime.co/themes/resideo/light/images/hero-1.jpg'
  imageUrl = 'assets/imgs/banner-02.jpg'

}
