import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnDestroy, OnInit, Output, afterNextRender } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { CardAnuncioComponent } from '../card-anuncio/card-anuncio.component';
import { CoreService } from '../../../services/core.service';
import { StoreService } from '../../../services/store.service';
import { UtilsService } from '../../../services/utils.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
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
export class SearchFilterComponent implements OnInit, OnDestroy {

  form = this.formBuilder.group({
    tipo: ['apartamento'],
    categoria: ['comprar'],
    termo: [''],
    preco_min: ['1000'],
    preco_max: ['1000000'],
    dorm_qtd: [''],
    suite_qtd: [''],
    vagas_qtd: [''],
    banh_qtd: [''],
    all: [false]
  });

  @Output() search = new EventEmitter<any>();
  @Output() clean = new EventEmitter<boolean>();

  openFilter = true;

  rangeMaxValue = 5;

  unsub$ = new Subject()

  constructor(
    public core: CoreService,
    private storeService: StoreService,
    private utils: UtilsService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {

    afterNextRender(() => {
      this.getParamsSearch();

    });
  }
  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete()
  }

  ngOnInit(): void {
    if (this.utils.widthSize.value < 920) {
      this.ctrlFilter(false)
    }
  }

  getParamsSearch(){
    this.activatedRoute.queryParams
    .pipe(takeUntil(this.unsub$))
    .subscribe(query => {
      const {anuncio, categoria, tipo, termo } = query;

      setTimeout(()=>{
        if(anuncio){
          this.verTodos();
          return ;
        };
  
        this.form.patchValue({
          categoria: categoria ?? '', tipo: tipo ?? '', termo: termo ?? ''
        });
  
        this.pesquisar()

      }, 1000)


    })
  }

  ctrlFilter(value: boolean) {
    this.openFilter = value;
  }

  pesquisar(all = false) {
    this.form.patchValue({ all });
    this.search.emit(this.form.value);

  }

  limpar() {
    this.verTodos()

  }

  verTodos() {
    this.ctrlFilter(false);

    this.form.patchValue({
      tipo: '',
      categoria: '',
      termo: '',
      preco_min: '',
      preco_max: '',
      dorm_qtd: '',
      suite_qtd: '',
      vagas_qtd: '',
      banh_qtd: '',
      all: true
    });

    this.pesquisar(true);

  }

  

}
