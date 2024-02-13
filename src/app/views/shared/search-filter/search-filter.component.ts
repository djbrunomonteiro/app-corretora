import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { CardAnuncioComponent } from '../card-anuncio/card-anuncio.component';
import { CoreService } from '../../../services/core.service';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    UrlFotosPipe,
    FavoritoPipe,
    CardAnuncioComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss'
})
export class SearchFilterComponent {

  openFilter = true;

  constructor(
    public core: CoreService,
    private storeService: StoreService,
  ){}

  ctrlFilter(value: boolean){
    this.openFilter = value;

  }

}
