import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  Inject,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { BehaviorSubject, combineLatestAll, firstValueFrom, from, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ESize } from '../../../enums/folders';
import { IAnuncio } from '../../../models/anuncio';
import { LeadService } from '../../../services/lead.service';
import { UploadService } from '../../../services/upload.service';
import { AnunciosStore } from '../../../store/anuncios-store';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {  FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CoreService } from '../../../services/core.service';
import { EMeta } from '../../../enums/meta';
import { MatChipsModule } from '@angular/material/chips';
import { YouTubePlayer } from '@angular/youtube-player';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ShareButtons } from 'ngx-sharebuttons/buttons';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { FormContatoComponent } from '../../shared/form-contato/form-contato.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { SwiperOptions } from 'swiper/types';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SlidesUltimosComponent } from '../../shared/slides-ultimos/slides-ultimos.component';
import { IAgendamento } from '../../../models/agendamento';
import { AgendamentosStore } from '../../../store/agendamentos-store';
import { UtilsService } from '../../../services/utils.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AnalyticsService } from '../../../services/analytics.service';
import { EEventsAnalytics } from '../../../enums/events-analitycs';
@Component({
  selector: 'app-destaque',
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
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SlidesUltimosComponent,
    MatProgressBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './destaque.component.html',
  styleUrl: './destaque.component.scss',
})
export class DestaqueComponent {
  anunciosStore = inject(AnunciosStore);
  agendamentoStore = inject(AgendamentosStore);
  analyticsService = inject(AnalyticsService);
  utils = inject(UtilsService);
  uploadService = inject(UploadService);
  leadService = inject(LeadService);
  formBuilder = inject(FormBuilder);
  core = inject(CoreService);
  router = inject(Router);
  anuncio!: IAnuncio;

  form = this.formBuilder.group({
    id_anuncio: [''],
    id_cliente: ['0'],
    titulo_anuncio: [''],
    cod_anuncio: [''],
    nome_cliente: ['', Validators.required],
    whatsapp: ['', Validators.required],
    email: [''],
    mensagem: [''],
    dias: ['', ],
    horarios: [''],
    status: ['aberto'],
    historico: [[]],
  })

  fotos$ = new BehaviorSubject<string[]>([]);
  size = ESize;
  loadedImgs = signal<boolean>(false);

  whatsapp = environment.whatsapp;
  videoId = '';

  breakpoints: SwiperOptions['breakpoints'] = {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 5,
      slidesOffsetAfter: 0.2,
      slidesOffsetBefore: 0.5,
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // when window width is >= 640px
    768: {
      slidesPerView: 3,
      spaceBetween: 10,
    },
    800: {
      slidesPerView: 2,
      spaceBetween: 0,
      grid: {
        rows: 1,
        fill: 'row'
      }
    },
  };

  urlWhatsapp = '';
  loading = false;
  isAgendamento = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) public platformId: Object,

  ) {
  }


  ngOnInit(): void {
    this.getAnuncio();
    
  }


  async getAnuncio() {
    if (isPlatformBrowser(this.platformId)) {
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      if (!id) {
        return;
      }

      await firstValueFrom(this.anunciosStore.loadOne(id))
      this.anuncio = this.anunciosStore.selectOne(id);
      this.setLOG(EEventsAnalytics.open_page)

      if (!this.anuncio) {
        return;
      }
      this.setUrlWhatsapp(this.anuncio)
      const key = this.removeHtmlTags(this.anuncio.descricao);
      this.core.setTitle(
        `Destaque imóvel - ${this.anuncio.titulo} - ${this.anuncio.end_cidade} / ${this.anuncio.end_uf}`
      );
      this.core.updateMeta(
        `Destaque imóvel - ${this.anuncio.titulo} - ${this.anuncio.end_cidade} / ${this.anuncio.end_uf}`,
        `${key} ${this.anuncio.end_cidade}, ${this.anuncio.end_uf}`
      );
      const { fotos, tour_virtual, status } = this.anuncio;
      this.getVideoId(tour_virtual);
      this.getImgs(fotos);

      console.log(status);
    }
  }

  removeHtmlTags(input: string | undefined): string {
    if (!input) {
      return EMeta.KEY_DEFAULT;
    }
    const regex = /<.*?>/g;
    return input.replace(regex, '');
  }

  async getImgs(fotos: any[] | undefined) {
    if (!fotos || !fotos.length) {
      return;
    }

    from(fotos)
      .pipe(
        map(
          async (foto) =>
            await this.uploadService.getFoto(foto, 'anuncios', this.size.large)
        ),
        combineLatestAll()
      )
      .subscribe((res) => {
        this.fotos$.next(res);
      });
  }

  getVideoId(tour_virtual: string) {
    if (!tour_virtual) { return }
    this.videoId = tour_virtual.split('watch?v=')[1] ?? '';
  }

  setUrlWhatsapp(anuncio: IAnuncio) {
    const texto = `Olá! Estou entrando em contato pelo site, e gostaria de informações sobre o imóvel ${anuncio.titulo} !`;
    const textoEncoded = encodeURIComponent(texto);
    this.urlWhatsapp = `https://api.whatsapp.com/send?phone=5598981272751&text=${textoEncoded}`

  }

  setLOG(event: EEventsAnalytics = EEventsAnalytics.open_whatsapp){
    this.analyticsService.setLog(event, '')
  }

  async salvar(){
    if(this.form.invalid){return}
    this.loading = true;
    this.form.patchValue({
      id_anuncio: this.anuncio.id,
      titulo_anuncio: this.anuncio.titulo ?? '',
      cod_anuncio: this.anuncio.codigo ?? '',
    });

 
    const item = {...this.form.value} as IAgendamento;
    const {error, message} = await this.agendamentoStore.saveOne(item);
    this.utils.showMessage(message, undefined, {duration: 5000});
    this.loading = false;
    if(error){return}
    this.isAgendamento = true
    this.form.patchValue({
      nome_cliente: '',
      whatsapp: '',
      dias: '',
      horarios: ''
    })

  }
}
