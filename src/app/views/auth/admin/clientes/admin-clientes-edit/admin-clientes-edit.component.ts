import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  form = this._formBuilder.group({
    id: [''],
    nome: ['', Validators.required],
    cpf_cnpj: ['', Validators.required],
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
    end_uf: ['',Validators.required],
    end_cidade: ['',Validators.required],
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
    created_at: ['']
  });

  estados: any[] = [];
  cidades: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private storeService: StoreService,
    private utils: UtilsService,
    public core: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ){}


  async ngOnInit(): Promise<void> {

    this.utils.getLocalidades().subscribe((res: any) => {
      this.estados = res?.estados;
      setTimeout(() => {
        this.form.patchValue({ end_uf: 'MA' })
      }, 500)
    })
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getItem(id);
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




  }

  salvar(){
    const item = {...this.form.value, url: this.createUrl()};
    console.log('itemm', item);

    let action: MyAction;
    let result$: Observable<IAction>;
    if(item.id){
      action = {group:EGroup.Cliente, action: EAction.UpdateOne, props: {item}}
      result$ = this.storeService.dispatchAction(action)
      result$.pipe(first()).subscribe(res => {
        this.utils.showMessage(res?.props?.message);
      })

    }else{
      action = {group:EGroup.Cliente, action: EAction.SetOne, props: {item}}
      result$ = this.storeService.dispatchAction(action)
      result$.pipe(first()).subscribe(res => {
        this.utils.showMessage(res?.props?.message);
  
        if(!res.props?.error){
        this.router.navigate([`auth/admin/clientes`])
        }
      })
    }


  }

  createUrl(){
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

  getItem(id: string){
    const result$ = this.storeService.dispatchAction({group: EGroup.Cliente, action: EAction.GetOne, params: {id}});
    this.storeService.select(OneCliente(id)).subscribe(res =>{
      this.form.patchValue({...res})
    })
  }
  


}
