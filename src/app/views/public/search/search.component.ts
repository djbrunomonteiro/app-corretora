import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CoreService } from '../../../services/core.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { StoreService } from '../../../services/store.service';
import { Observable, first } from 'rxjs';
import { EGroup, EAction } from '../../../store/app.actions';
import { AllAnuncios } from '../../../store/selectors/anuncio.selector';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { CardAnuncioComponent } from '../../shared/card-anuncio/card-anuncio.component';
import { SearchFilterComponent } from '../../shared/search-filter/search-filter.component';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    UrlFotosPipe,
    FavoritoPipe,
    CardAnuncioComponent,
    SearchFilterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  anuncios$!: Observable<any[]>

  constructor(
    public core: CoreService,
    private storeService: StoreService,
  ){}

  ngOnInit(): void {
    this.getItens();
  }

  getItens(){
    const result$ = this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.GetAll});
    result$.pipe(first()).subscribe((r) =>{
      this.anuncios$ = this.storeService.select(AllAnuncios);
      this.anuncios$.subscribe(res => {
      } )
    })

  }
}
