import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { StoreService } from '../../../services/store.service';
import { EAction, EGroup } from '../../../store/app.actions';
import { Observable, first } from 'rxjs';
import { AllAnuncios, OneAnuncio } from '../../../store/selectors/anuncio.selector';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anuncio-details',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    UrlFotosPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './anuncio-details.component.html',
  styleUrl: './anuncio-details.component.scss'
})
export class AnuncioDetailsComponent implements OnInit {

  anuncio$!: Observable<any>
  constructor(
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
  ){}

  ngOnInit(): void {
    const url = this.activatedRoute.snapshot.paramMap.get('url');
    if (!url) { return };
    this.getItem(url);
  }

  getItem(url: string){
    const result$ = this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.GetAll});
    result$.pipe(first()).subscribe((r) =>{
      console.log('chamouu ?', r);
      
      this.anuncio$ = this.storeService.select(OneAnuncio(url));
      this.anuncio$.subscribe(res => {
        console.log('res', res);
      } )
    })

  }

}
