import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, Inject, OnInit, PLATFORM_ID, Signal, afterNextRender, effect, inject, signal } from '@angular/core';
import { MaterialModule } from '../../../modules/material/material.module';
import { CoreService } from '../../../services/core.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { StoreService } from '../../../services/store.service';
import { BehaviorSubject, Observable, Subject, first, map, takeUntil } from 'rxjs';
import { EGroup, EAction } from '../../../store/app.actions';
import { AllAnuncios, SearchAnuncios } from '../../../store/selectors/anuncio.selector';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { CardAnuncioComponent } from '../../shared/card-anuncio/card-anuncio.component';
import { SearchFilterComponent } from '../../shared/search-filter/search-filter.component';
import { ScrollableDirective } from '../../../directives/scrollable.directive';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { AnunciosStore } from '../../../store/anuncios-store';
import { IAnuncio } from '../../../models/anuncio';
import { EMeta } from '../../../enums/meta';


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

  searchFilter: any;

  count = 6;
  increment = 6;

  form = this.formBuilder.group({
    ordenar: ['']
  });
  ordenarCtrl = this.form.get('ordenar') as FormControl;

  anunciosStore = inject(AnunciosStore)
  loading = signal(true);

  anuncios!: Signal<IAnuncio[]>;
  recomendados!: Signal<IAnuncio[]>;


  loading$ = new BehaviorSubject(true);
  unsub$ = new Subject()

  constructor(
    public core: CoreService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) public platformId: Object,

  ) {

  }

  ngOnInit(): void {
    this.core.setTitle(`Telma Monteiro - Encontre os melhores imóveis no Maranhão para compra, venda ou aluguel com a corretora especializada.`);
    this.core.updateMeta(EMeta.DESC_SEARCH, EMeta.KEY_SEARCH);
    this.listarTodos();
    this.form.valueChanges
    .pipe(takeUntil(this.unsub$))
    .subscribe(c =>{
      if(!this.anuncios().length || !this.searchFilter){
        this.anuncios = this.anunciosStore.allItens;
        return
      }
      this.pesquisar(this.searchFilter)
    })

  }

  listarTodos(){
    this.anuncios = this.anunciosStore.allItens
  }

  pesquisar(form: any) {
    form.preco_min = Number(form.preco_min) ?? 0;
    form.preco_max = Number(form.preco_max) ?? 0;
    if (form.preco_min > form.preco_max) {
      const preco_max = Number(form.preco_min);
      const preco_min = Number(form.preco_max);
      form = { ...form, preco_min, preco_max }
    }

    this.anuncios = this.anunciosStore.search(form, this.form.value.ordenar);
    this.recomendados = this.anunciosStore.allItens;

  }


  @HostListener('window:scroll', [])
  onScroll() {
    if(isPlatformBrowser(this.platformId)){
      const viewportHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if(!this.anuncios().length){return}
      // this.anuncios$.pipe(
      //   takeUntil(this.unsub$),
      //   first())
      //   .subscribe(elem => {
      //   if (elem.length > this.count && window.pageYOffset + viewportHeight >= scrollHeight) {
      //     this.count += this.increment;
      //   }
      // })
    

    }
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }

}
