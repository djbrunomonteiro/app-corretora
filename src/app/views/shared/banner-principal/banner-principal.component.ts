import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchComponent } from '../../public/search/search.component';
import { SearchHomeComponent } from '../search-home/search-home.component';

@Component({
  selector: 'app-banner-principal',
  standalone: true,
  imports: [
    CommonModule,
    SearchHomeComponent
  ],
  templateUrl: './banner-principal.component.html',
  styleUrl: './banner-principal.component.scss'
})
export class BannerPrincipalComponent {

}
