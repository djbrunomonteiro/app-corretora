import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Inject, OnInit, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { ActivatedRoute } from '@angular/router';
import { FormContatoComponent } from '../../shared/form-contato/form-contato.component';
import { MatDialog } from '@angular/material/dialog';
import { AgendamentoComponent } from '../../shared/agendamento/agendamento.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ESize } from '../../../enums/folders';
import { AnunciosStore } from '../../../store/anuncios-store';
import { IAnuncio } from '../../../models/anuncio';
import { CoreService } from '../../../services/core.service';
import { EMeta } from '../../../enums/meta';
import { UploadService } from '../../../services/upload.service';
import { BehaviorSubject, combineLatestAll, from, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

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

  anunciosStore = inject(AnunciosStore);
  uploadService = inject(UploadService);
  anuncio!: IAnuncio

  fotos$ = new BehaviorSubject<string[]>([])
  size = ESize;
  loadedImgs = signal<boolean>(false)

  whatsapp = environment.whatsapp
  
  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) public platformId: Object,
    private core: CoreService
  ){
    effect(() => {
      this.getAnuncio();
    })

  }

  ngOnInit(): void {
    this.getAnuncio();
  }

  async getAnuncio(){
    if(isPlatformBrowser(this.platformId)){
      const url = this.activatedRoute.snapshot.paramMap.get('url');
      if (!url) { return };
      this.anuncio = this.anunciosStore.selectOne(url)
      if(!this.anuncio){return}
      const key = this.removeHtmlTags(this.anuncio.descricao);
      this.core.setTitle(`${this.anuncio.titulo} - ${this.anuncio.tipo} - ${key} - ${this.anuncio.end_cidade} / ${this.anuncio.end_uf}`);
      this.core.updateMeta(`Telma Monteiro - ${this.anuncio.tipo} - ${this.anuncio.titulo} - ${this.anuncio.end_cidade} / ${this.anuncio.end_uf}`, `${key} ${this.anuncio.end_cidade}, ${this.anuncio.end_uf}`);
      const {fotos} = this.anuncio;
      this.getImgs(fotos);
    }
  }

  async getImgs(fotos: any[] | undefined){
    if(!fotos || !fotos.length){return};

    from(fotos).pipe(
      map(async (foto) => await this.uploadService.getFoto(foto, 'anuncios', this.size.large)),
      combineLatestAll()
    ).subscribe(res => {
      this.fotos$.next(res);
    } )

  }

  removeHtmlTags(input: string | undefined): string {
    if(!input){return EMeta.KEY_DEFAULT}
    const regex = /<.*?>/g;
    return input.replace(regex, '');
}


  openContato(anuncio?: any){
    const dialogRef = this.dialog.open(FormContatoComponent, {disableClose: false, data: {anuncio}, maxHeight: 900, minWidth: 375,} );
  }

  agendar(anuncio: any){
    if(!anuncio){return;};
    const dialogRef = this.dialog.open(AgendamentoComponent, {disableClose: false, data: {anuncio }, maxHeight: 900, minWidth: 375, panelClass: 'dialog-custom'} );
  }

  openWhatsapp() {
    if(isPlatformBrowser(this.platformId)){
      window.open(this.whatsapp, '_blank');
    }
    
  }
}
