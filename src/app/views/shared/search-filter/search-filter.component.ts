import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { CardAnuncioComponent } from '../card-anuncio/card-anuncio.component';
import { CoreService } from '../../../services/core.service';
import { StoreService } from '../../../services/store.service';
import { UtilsService } from '../../../services/utils.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
export class SearchFilterComponent implements OnInit {

  form = this.formBuilder.group({
    tipo: ['apartamento'],
    categoria: ['comprar'],
    termo: [''],
    preco_min: [''],
    preco_max: [''],
    dorm_qtd: [''],
    suite_qtd: [''],
    vagas_qtd: [''],
    banh_qtd: [''],
  });

  @Output() search = new EventEmitter<any>();
  @Output() clean = new EventEmitter<boolean>();

  openFilter = true;

  constructor(
    public core: CoreService,
    private storeService: StoreService,
    private utils: UtilsService,
    private formBuilder: FormBuilder
  ){}
  
  ngOnInit(): void {
    if(this.utils.widthSize.value < 920){
      this.ctrlFilter(false)
    }
  }

  ctrlFilter(value: boolean){
    this.openFilter = value;
  }

  pesquisar(){
    this.search.emit(this.form.value);
  }

  limpar(){
    this.form.patchValue({
      tipo: 'apartamento',
      categoria: 'comprar',
      termo: '',
      preco_min: '',
      preco_max: '',
      dorm_qtd: '',
      suite_qtd: '',
      vagas_qtd: '',
      banh_qtd: '',
    });

    this.clean.emit(true)

  }

}
