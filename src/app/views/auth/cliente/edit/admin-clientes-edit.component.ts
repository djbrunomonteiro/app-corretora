import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../../pipes/url-fotos.pipe';
import { CoreService } from '../../../../services/core.service';
import { StoreService } from '../../../../services/store.service';
import { UtilsService } from '../../../../services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '../../../../services/upload.service';
import { CardAnuncioComponent } from '../../../shared/card-anuncio/card-anuncio.component';
import { ListAnuncioRecentesComponent } from '../../../shared/list-anuncio-recentes/list-anuncio-recentes.component';
import { CentralAjudaComponent } from '../../../shared/central-ajuda/central-ajuda.component';
import { ClienteDuvidaComponent } from '../../../shared/cliente-duvida/cliente-duvida.component';
import { ListAgendamentosComponent } from '../../../shared/list-agendamentos/list-agendamentos.component';
import { ClientesStore } from '../../../../store/cliente-store';
import { ICliente } from '../../../../models/cliente';
import { IAnuncio } from '../../../../models/anuncio';
import { AnunciosStore } from '../../../../store/anuncios-store';
import { ETabs } from '../../../../enums/tabs';
import { UserStore } from '../../../../store/user-store';

@Component({
  selector: 'app-admin-clientes-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    UrlFotosPipe,
    CardAnuncioComponent,
    ListAnuncioRecentesComponent,
    CentralAjudaComponent,
    ClienteDuvidaComponent,
    ListAgendamentosComponent,
  ],

  templateUrl: './admin-clientes-edit.component.html',
  styleUrl: './admin-clientes-edit.component.scss',
})
export class AdminClientesEditComponent implements OnInit, AfterViewInit {
  @Input() isCadastroPublic: boolean = false;
  @Output() resCadastroPublicEvent = new EventEmitter<any>();

  clienteStore = inject(ClientesStore);
  userStore = inject(UserStore);
  anuncioStore = inject(AnunciosStore);

  clienteRef!: ICliente;
  form = this._formBuilder.group({
    id: [''],
    nome: ['', Validators.required],
    cpf_cnpj: ['', Validators.required],
    data_nasc: ['', Validators.required],
    whatsapp: ['', Validators.required],
    telefone: [''],
    email: [''],
    profissao: [''],
    renda: [''],
    cofinanciado: ['nao'],
    cofinanciador: this._formBuilder.group({
      nome: [''],
      cpf_cnpj: [''],
      grau_parantesco: [''],
      whatsapp: [''],
      telefone: [''],
      email: [''],
      profissao: [''],
      renda: [''],
    }),
    foto: [''],
    end_cep: [''],
    end_uf: ['', Validators.required],
    end_cidade: ['', Validators.required],
    end_bairro: [''],
    end_logradouro: [''],
    end_numero: [''],
    end_complemento: [''],
    url: [''],
    documentacao: this._formBuilder.array([]),
    estado_civil: [''],
    tipo_compra: [''],
    preferencia: this._formBuilder.group({
      categoria: [''],
      tipo: [''],
      modalidade: [''],
      preco_min: [''],
      preco_max: [''],
      uf: [''],
      cidade: [''],
      bairros: [[]],
      qtd_suite: [''],
      qtd_dorm: [''],
      qtd_ban: [''],
      qtd_vaga: [''],
    }),
    favoritos: [[]],
    recomendados: [[]],
    hash: [''],
    created_at: [''],
  });

  estados: any[] = [];
  cidades: any[] = [];

  ctrlDocumentacao = this.form.get('documentacao') as FormArray;
  filesCtrl = new FormControl();

  displayedColumns: string[] = [
    'index',
    'tipo_cliente',
    'tipo_arquivo',
    'nome',
    'acoes',
  ];
  dataSource = [];
  loadingUpload = false;
  tabIndex = 0;
  folders: any[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    },
  ];
  notes: any[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
  ];

  favoritos: IAnuncio[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private utils: UtilsService,
    public core: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uploadService: UploadService
  ) {
    effect(() =>{
      this.getFavoritos();
    })
  }

  async ngOnInit(): Promise<void> {
    this.utils.getLocalidades().subscribe((res: any) => {
      this.estados = res?.estados;
      setTimeout(() => {
        this.form.patchValue({ end_uf: 'MA' });
      }, 500);
    });

    this.getCliente();

    this.activatedRoute.queryParams.subscribe((q: any) =>{
      switch(q?.tab){
        case ETabs.favorito:
          this.tabIndex = 3
          break;
        case ETabs.agendamento:
          this.tabIndex = 2
          break;
        case ETabs.preferencia:
          this.tabIndex = 1
          break;
        default:
          this.tabIndex = 0
          break;
      }
    });
  }

  getCliente() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (!id) {return;}
    this.clienteRef = this.clienteStore.selectOne(id);
    if (!this.clienteRef) { return;}
    this.form.patchValue({ ...this.clienteRef });
    this.getFavoritos();
  }

  getFavoritos() {
    if(!this.clienteRef){return}
    this.favoritos = this.clienteRef.favoritos.map((id: string) => {
      const anuncio = this.anuncioStore.selectOne(id);
      return anuncio;
    });
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe((c) => {
      if (c?.end_uf) {
        this.cidades =
          this.estados
            .filter((elem: any) => elem?.sigla === c.end_uf)
            .map((elem: any) => elem.cidades)[0] ?? [];
        setTimeout(() => {
          if (c?.end_uf === 'MA') {
            this.form.patchValue({ end_cidade: 'São Luís' });
          }
        }, 500);
      }
    });
  }

  async salvar() {
    const item = {
      ...this.form.value,
      data_nasc: String(this.form.value.data_nasc),
      url: this.createUrl(),
    } as ICliente;
    
    const { error, message, results } = await this.clienteStore.saveOne(item);
    this.utils.showMessage(message);
    if (error || item.id) {
      return;
    };

    if(this.isCadastroPublic){
      console.log(results);
      localStorage.setItem('access_token', results.hash)
      this.router.navigate([`auth/cliente/${results.id}`]);
      return;
    };


    this.router.navigate([`auth/admin/clientes`]);

  }

  createUrl() {
    const nome = String(this.form.value.nome).toLocaleLowerCase();
    let cpf_cnpj = String(this.form.value.cpf_cnpj).toLocaleLowerCase();
    cpf_cnpj = cpf_cnpj.slice(cpf_cnpj.length - 4);

    let result = `${nome} ${cpf_cnpj}`;
    result = result
      .replace(/[áàãâäéèêëíìîïóòõôöúùûü]/g, (match) => {
        switch (match) {
          case 'á':
            return 'a';
          case 'à':
            return 'a';
          case 'ã':
            return 'a';
          case 'â':
            return 'a';
          case 'ä':
            return 'a';
          case 'é':
            return 'e';
          case 'è':
            return 'e';
          case 'ê':
            return 'e';
          case 'ë':
            return 'e';
          case 'í':
            return 'i';
          case 'ì':
            return 'i';
          case 'î':
            return 'i';
          case 'ï':
            return 'i';
          case 'ó':
            return 'o';
          case 'ò':
            return 'o';
          case 'õ':
            return 'o';
          case 'ô':
            return 'o';
          case 'ö':
            return 'o';
          case 'ú':
            return 'u';
          case 'ù':
            return 'u';
          case 'û':
            return 'u';
          case 'ü':
            return 'u';
          default:
            return match;
        }
      })
      .replace(/\s+/g, '-');

    return `cliente/${result}`;
  }

  async upload(files: File[]) {
    this.loadingUpload = true;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const folder = `documentos/${this.form.value.id}`;
      const res = await this.uploadService.uploadFILE(file, folder);
      if (res) {
        this.addDocumento(res);
      }
    }

    this.loadingUpload = false;
  }

  addDocumento(path: string) {
    const nome = path.split('/')[2];
    const grupo = this._formBuilder.group({
      tipo_cliente: ['principal'],
      tipo_arquivo: ['Outros'],
      path: [path],
      nome: [nome],
    });
    this.ctrlDocumentacao.push(grupo);
    this.dataSource = this.ctrlDocumentacao.value;
  }
}
