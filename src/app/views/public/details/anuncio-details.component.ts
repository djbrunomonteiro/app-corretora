import { AnalyticsService } from './../../../services/analytics.service';
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
import { YOUTUBE_PLAYER_CONFIG, YouTubePlayer } from '@angular/youtube-player';
import { IMenu } from '../../../models/menu';

import {
  provideShareButtonsOptions,
  SharerMethods,
  withConfig,
} from 'ngx-sharebuttons';
import { ShareButtons } from 'ngx-sharebuttons/buttons';
import { shareIcons } from 'ngx-sharebuttons/icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { EEventsAnalytics } from '../../../enums/events-analitycs';
import { LeadService } from '../../../services/lead.service';
import {MatChipsModule} from '@angular/material/chips';
import { FormDesbloquearPrecoComponent } from '../../shared/form-desbloquear-preco/form-desbloquear-preco.component';
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
    LoadingComponent,
    YouTubePlayer,
    FontAwesomeModule,
    ShareButtons,
    MatChipsModule,
    FormDesbloquearPrecoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: YOUTUBE_PLAYER_CONFIG,
    useValue: {
      disablePlaceholder: true
    }
  },
  provideShareButtonsOptions(
    shareIcons(),
    withConfig({
      debug: true,
      sharerMethod: SharerMethods.Anchor,
    })
  ),
],
  templateUrl: './anuncio-details.component.html',
  styleUrl: './anuncio-details.component.scss'
})
export class AnuncioDetailsComponent implements OnInit {

  anunciosStore = inject(AnunciosStore);
  uploadService = inject(UploadService);
  leadService = inject(LeadService);
  anuncio!: IAnuncio

  fotos$ = new BehaviorSubject<string[]>([])
  size = ESize;
  loadedImgs = signal<boolean>(false)

  whatsapp = environment.whatsapp;
  videoId = '';


  empresaMenu: IMenu[] = [
    {
      title: 'Whatsapp',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: environment.whatsapp,
      target: '_blank'
    },    
    {
      title: 'Instagram',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.instagram.com/telmamonteirodematos?igsh=MTl0ZXoycmY2YTNvYQ==',
      target: '_blank'
    },    {
      title: 'Facebook',
      iconlabel: 'perm_phone_msg',
      icon: 'perm_phone_msg',
      url: 'https://www.facebook.com/telma.monteiro.79?mibextid=ZbWKwL',
      target: '_blank'
    },
  ];

  excludeBtns = ['pinterest',  'reddit', 'viber', 'sms', 'vk', 'mix', 'xing', 'line', 'tumblr', 'whatsapp'];
  
  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private library: FaIconLibrary,
    @Inject(PLATFORM_ID) public platformId: Object,
    private core: CoreService,
    private analyticsService: AnalyticsService
  ){
    effect(() => {
      this.getAnuncio();
      this.leadService.checkCollectedContact()
    });
    library.addIconPacks(fas, fab)

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
      const {fotos, tour_virtual} = this.anuncio;
      this.getVideoId(tour_virtual)
      this.getImgs(fotos);
      this.analyticsService.setLog(EEventsAnalytics.view_item, {anuncio_titulo: this.anuncio.titulo, anuncio_id: this.anuncio.id})
    }
  }

  getVideoId(tour_virtual: string){
    if(!tour_virtual){return}
    this.videoId = tour_virtual.split('watch?v=')[1] ?? '';
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

  desbloquearPreco(){
    const dialogRef = this.dialog.open(FormDesbloquearPrecoComponent, {disableClose: false, maxHeight: 900, minWidth: 375, panelClass: 'dialog-custom'} );
    this.analyticsService.setLog(EEventsAnalytics.open_formulario, {anuncio_titulo: this.anuncio.titulo, anuncio_id: this.anuncio.id})
  }

  openContato(anuncio?: any){
    const dialogRef = this.dialog.open(FormContatoComponent, {disableClose: false, data: {anuncio}, maxHeight: 900, minWidth: 375,} );
    this.analyticsService.setLog(EEventsAnalytics.open_formulario, {anuncio_titulo: this.anuncio.titulo, anuncio_id: this.anuncio.id})
  }

  agendar(anuncio: any){
    if(!anuncio){return;};
    const dialogRef = this.dialog.open(AgendamentoComponent, {disableClose: false, data: {anuncio }, maxHeight: 900, minWidth: 375, panelClass: 'dialog-custom'} );
    this.analyticsService.setLog(EEventsAnalytics.open_formulario, {anuncio_titulo: this.anuncio.titulo, anuncio_id: this.anuncio.id})

  }

  openWhatsapp() {
    if(isPlatformBrowser(this.platformId)){
      window.open(this.whatsapp, '_blank');
      this.analyticsService.setLog(EEventsAnalytics.open_whatsapp, {anuncio_titulo: this.anuncio.titulo, anuncio_id: this.anuncio.id})
    }
    
  }
}
