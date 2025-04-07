import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnDestroy, OnInit, Output, afterNextRender } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { CardAnuncioComponent } from '../card-anuncio/card-anuncio.component';
import { CoreService } from '../../../services/core.service';
import { UtilsService } from '../../../services/utils.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-search-filter',
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
  @Output() search = new EventEmitter<any>();
  @Output() clean = new EventEmitter<boolean>();

  form = this.formBuilder.group({
    tipo: ['apartamento'],
    categoria: ['comprar'],
    termo: [''],
    preco_min: ['1000'],
    preco_max: ['1000000000'],
    dorm_qtd: [''],
    suite_qtd: [''],
    vagas_qtd: [''],
    banh_qtd: [''],
    all: [true]
  });
  openFilter = true;
  rangeMaxValue = 5;
  unsub$ = new Subject()

  constructor(
    public core: CoreService,
    private utils: UtilsService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.getParamsSearch();
    if (this.utils.widthSize.value < 920) {
      this.ctrlFilter(false)
    }

  }

  getParamsSearch(){
    this.activatedRoute.queryParams
    .pipe(takeUntil(this.unsub$))
    .subscribe(query => {
      const {anuncios, categoria, tipo, termo } = query;
      setTimeout(()=>{
        if(!anuncios){
          this.form.patchValue({categoria: categoria ?? '', tipo: tipo ?? '', termo: termo ?? '' });
          this.pesquisar()
        }
      }, 500)
    })
  }

  ctrlFilter(value: boolean) {
    this.openFilter = value;
  }

  pesquisar(all = false) {
    this.form.patchValue({ all });
    this.search.emit(this.form.value);
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

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete()
  }

}
