import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit, PLATFORM_ID, afterNextRender } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { StoreService } from '../../../services/store.service';
import { EAction, EGroup } from '../../../store/app.actions';
import { Observable, Subject, first, takeUntil } from 'rxjs';
import { AllAnuncios, OneAnuncio } from '../../../store/selectors/anuncio.selector';
import { ActivatedRoute } from '@angular/router';
import { FormContatoComponent } from '../../shared/form-contato/form-contato.component';
import { MatDialog } from '@angular/material/dialog';
import { AgendamentoComponent } from '../../shared/agendamento/agendamento.component';
import { LoadingComponent } from '../../shared/loading/loading.component';

@Component({
  selector: 'app-anuncio-details',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    UrlFotosPipe,
    FormContatoComponent,
    LoadingComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './anuncio-details.component.html',
  styleUrl: './anuncio-details.component.scss'
})
export class AnuncioDetailsComponent implements OnInit {

  anuncio$!: Observable<any>;;

  loading = true;
  unsub$ = new Subject()
  constructor(
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) public platformId: Object,
  ){

    afterNextRender(() => {
      const url = this.activatedRoute.snapshot.paramMap.get('url');
      if (!url) { return };
      this.getItem(url);
    });
  }

  ngOnInit(): void {

  }

  getItem(url: string){
    if(!url){return}
    this.loading = true;
    const result$ = this.storeService.dispatchAction({group: EGroup.Anuncio, action: EAction.GetAll});
    result$.pipe(first()).subscribe((e) =>{
      this.anuncio$ = this.storeService.select(OneAnuncio(url)).pipe(takeUntil(this.unsub$));
      this.loading = false;
    })

  }

  openContato(anuncio?: any){
    const dialogRef = this.dialog.open(FormContatoComponent, {disableClose: false, data: {anuncio}, minWidth: '50vw', height: '90vh'} );
  }

  agendar(anuncio: any){
    if(!anuncio){return;};
    const dialogRef = this.dialog.open(AgendamentoComponent, {disableClose: false, data: {anuncio },  minWidth: '50vw', height: '90vh'} );

  }

  openWhatsapp() {
    if(!isPlatformBrowser(this.platformId)){
      window.open('https://api.whatsapp.com/send?phone=5598970278027&text=Estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20site%20telmamonteiro.com.br%20e%20gostaria%20de%20solicitar%20atendimento.', '_blank');
    }
    
  }


}
