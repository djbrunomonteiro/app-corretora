import { CommonModule, DOCUMENT } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, OnInit, afterNextRender } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CoreService } from '../../../services/core.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { StoreService } from '../../../services/store.service';
import { Observable, first, map } from 'rxjs';
import { EGroup, EAction } from '../../../store/app.actions';
import { AllAnuncios, SearchAnuncios } from '../../../store/selectors/anuncio.selector';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { CardAnuncioComponent } from '../../shared/card-anuncio/card-anuncio.component';
import { SearchFilterComponent } from '../../shared/search-filter/search-filter.component';
import { ScrollableDirective } from '../../../directives/scrollable.directive';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    UrlFotosPipe,
    FavoritoPipe,
    CardAnuncioComponent,
    SearchFilterComponent,
    ScrollableDirective,
    LoadingComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  anuncios$!: Observable<any[]>
  recomendados$!: Observable<any[]>;
  count = 6;
  increment = 6;

  form = this.formBuilder.group({
    ordenar: ['']
  });

  ordenarCtrl = this.form.get('ordenar') as FormControl;

  loading = false;


  constructor(
    public core: CoreService,
    private storeService: StoreService,
    private formBuilder: FormBuilder
  ) {

    afterNextRender(() => {
      this.getItens();
      this.form.patchValue({ordenar: this.core.orders[0]})
    });


  }

  ngOnInit(): void {

  }


  getItens() {
    this.loading = true;
    const result$ = this.storeService.dispatchAction({ group: EGroup.Anuncio, action: EAction.GetAll });
    result$.pipe(first()).subscribe(() => {
      this.loading = false;
      this.listarTodos();
    } )
  }

  listarTodos() {
    this.anuncios$ = this.storeService.select(AllAnuncios);
  }

  pesquisar(form: any) {
    form.preco_min = Number(form.preco_min) ?? 0;
    form.preco_max = Number(form.preco_max) ?? 0;
    if (form.preco_min > form.preco_max) {
      const preco_max = Number(form.preco_min);
      const preco_min = Number(form.preco_max);
      form = { ...form, preco_min, preco_max }
    }

    this.anuncios$ = this.storeService.select(SearchAnuncios(form)).pipe(map(res => res.results));
    this.recomendados$ = this.storeService.select(SearchAnuncios(form)).pipe(map(res => res.recomends));
  }


  @HostListener('window:scroll', [])
  onScroll() {
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if(!this.anuncios$){return}
    this.anuncios$.pipe(first()).subscribe(elem => {
      if (elem.length > this.count && window.pageYOffset + viewportHeight >= scrollHeight) {
        this.count += this.increment;
      }
    })
  

  }

  ngOnDestroy() {
    // window.removeEventListener('scroll', this.onScroll);
  }

}
