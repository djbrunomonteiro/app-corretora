import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../../../pipes/url-fotos.pipe';
import { CoreService } from '../../../../../services/core.service';
import { StoreService } from '../../../../../services/store.service';
import { UtilsService } from '../../../../../services/utils.service';
import { Observable, first } from 'rxjs';
import { MyAction, EGroup, EAction, IAction } from '../../../../../store/app.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { OneCliente } from '../../../../../store/selectors/cliente.selector';
import { UploadService } from '../../../../../services/upload.service';

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
    UrlFotosPipe
  ],
  templateUrl: './admin-clientes-edit.component.html',
  styleUrl: './admin-clientes-edit.component.scss'
})
export class AdminClientesEditComponent {

  @Input() cliente$: any;


  form = this._formBuilder.group({
    id: [''],
    nome: ['', Validators.required],
    cpf_cnpj: ['', Validators.required],
    data_nasc: ['', Validators.required],
    whatsapp: [''],
    telefone: [''],
    email: ['', Validators.email],
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
    auth: [false],
    hash: [''],
    created_at: ['']
  });

  estados: any[] = [];
  cidades: any[] = [];

  ctrlDocumentacao = this.form.get('documentacao') as FormArray;
  filesCtrl = new FormControl();

  displayedColumns: string[] = ['index', 'tipo_cliente', 'tipo_arquivo', 'nome', 'acoes'];
  dataSource = [];

  loadingUpload = false;

  constructor(
    private _formBuilder: FormBuilder,
    private storeService: StoreService,
    private utils: UtilsService,
    public core: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uploadService: UploadService
  ) { }


  async ngOnInit(): Promise<void> {

    this.utils.getLocalidades().subscribe((res: any) => {
      this.estados = res?.estados;
      setTimeout(() => {
        this.form.patchValue({ end_uf: 'MA' })
      }, 500)
    });
    if (this.cliente$) {

      this.cliente$.pipe(first()).subscribe((res: any) => {
        this.form.patchValue({ ...res, auth: true });
        for (let index = 0; index < res.documentacao.length; index++) {
          const elem =  res.documentacao[index]
          const grupo = this._formBuilder.group({
            tipo_cliente: [elem?.tipo_cliente],
            tipo_arquivo: [elem?.tipo_arquivo],
            path: [elem?.path],
            nome: [elem?.nome]
          });
          this.ctrlDocumentacao.push(grupo)          
        };

        this.dataSource = this.ctrlDocumentacao.value;
      })

    } else {
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id) {
        this.getItem(id);
      }
    }


  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(c => {
      if (c?.end_uf) {
        this.cidades = this.estados.filter((elem: any) => elem?.sigla === c.end_uf).map((elem: any) => elem.cidades)[0] ?? [];
        setTimeout(() => {
          if (c?.end_uf === 'MA') {
            this.form.patchValue({ end_cidade: 'São Luís' })
          }
        }, 500)
      }
    });

    this.filesCtrl.valueChanges.subscribe(c => {
      if (!c?.length) { return; }
      this.upload(c);
    });

  }

  salvar() {
    const item = { ...this.form.value, data_nasc: String(this.form.value.data_nasc), url: this.createUrl() };

    console.log('item atualizado', item);
    
    let action: MyAction;
    let result$: Observable<IAction>;
    if (item.id) {
      action = { group: EGroup.Cliente, action: EAction.UpdateOne, props: { item } }
      result$ = this.storeService.dispatchAction(action)
      result$.pipe(first()).subscribe(res => {
        this.utils.showMessage(res?.props?.message);
      })

    } else {
      action = { group: EGroup.Cliente, action: EAction.SetOne, props: { item } }
      result$ = this.storeService.dispatchAction(action)
      result$.pipe(first()).subscribe(res => {
        this.utils.showMessage(res?.props?.message);

        if (!res.props?.error) {

          this.router.navigate([`auth/admin/clientes`])
        }
      })
    }


  }

  createUrl() {
    const nome = String(this.form.value.nome).toLocaleLowerCase();
    let cpf_cnpj = String(this.form.value.cpf_cnpj).toLocaleLowerCase()
    cpf_cnpj = cpf_cnpj.slice(cpf_cnpj.length - 4);

    let result = `${nome} ${cpf_cnpj}`;
    result = result.replace(/[áàãâäéèêëíìîïóòõôöúùûü]/g, (match) => {
      switch (match) {
        case "á": return "a";
        case "à": return "a";
        case "ã": return "a";
        case "â": return "a";
        case "ä": return "a";
        case "é": return "e";
        case "è": return "e";
        case "ê": return "e";
        case "ë": return "e";
        case "í": return "i";
        case "ì": return "i";
        case "î": return "i";
        case "ï": return "i";
        case "ó": return "o";
        case "ò": return "o";
        case "õ": return "o";
        case "ô": return "o";
        case "ö": return "o";
        case "ú": return "u";
        case "ù": return "u";
        case "û": return "u";
        case "ü": return "u";
        default: return match;
      }
    }).replace(/\s+/g, '-');

    return `cliente/${result}`;

  }

  getItem(id: string) {
    console.log('id', id);

    const result$ = this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.GetOne, params: { id } });
    this.storeService.select(OneCliente(id)).subscribe(res => {
      this.form.patchValue({ ...res })
    })
  }

  async upload(files: File[]) {
    this.loadingUpload = true;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const folder = `documentos/${this.form.value.id}`
      const res = await this.uploadService.uploadFILE(file, folder);
      if (res) {
        this.addDocumento(res)
      }
    }

    this.loadingUpload = false;


  }

  addDocumento(path: string) {
    const nome = path.split('/')[2]
    console.log(nome[2]);
    console.log(this.ctrlDocumentacao);
    const grupo = this._formBuilder.group({
      tipo_cliente: ['principal'],
      tipo_arquivo: ['Outros'],
      path: [path],
      nome: [nome]
    })
    this.ctrlDocumentacao.push(grupo);
    this.dataSource = this.ctrlDocumentacao.value
  }



}
