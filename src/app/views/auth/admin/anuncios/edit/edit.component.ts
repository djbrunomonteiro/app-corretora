import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UtilsService } from '../../../../../services/utils.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { EFolderUpload } from '../../../../../enums/folders';
import { BehaviorSubject, Observable, first } from 'rxjs';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { UploadService } from '../../../../../services/upload.service';
import { UrlFotosPipe } from '../../../../../pipes/url-fotos.pipe';
import { StoreService } from '../../../../../services/store.service';
import { EAction, EGroup, IAction, MyAction } from '../../../../../store/app.actions';
import { CoreService } from '../../../../../services/core.service';
import { NgxEditorModule } from 'ngx-editor';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-edit',
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
    NgxEditorModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class AdminAnuncioEditComponent implements OnInit, AfterViewInit, OnDestroy {

  editor!: Editor;
  html = '';

  form = this._formBuilder.group({
    id: [''],
    status: ['aberto'],
    titulo: ['', Validators.required],
    descricao: [''],
    codigo: [''],
    categoria: ['', Validators.required],
    tipo: ['', Validators.required],
    preco: ['',Validators.required],
    iptu: [''],
    condominio: [''],
    area_util: [''],
    qtd_suite: [''],
    qtd_dorm: [''],
    qtd_ban: [''],
    qtd_vaga: [''],
    dets_imovel: [''],
    dets_area_comum: [''],
    dets_proximidades: [''],
    dets_outros: [''],
    fotos: [['']],
    tour_virtual: [''],
    end_cep: [''],
    end_uf: ['',Validators.required],
    end_cidade: ['',Validators.required],
    end_bairro: [''],
    end_logradouro: [''],
    end_numero: [''],
    end_complemento: [''],
    url: [''],
    created_at: ['']
  });

  ctrltitulo = this.form.get('titulo') as FormControl;
  ctrldescricao = this.form.get('descricao') as FormControl;
  ctrlcategoria = this.form.get('categoria') as FormControl;
  ctrltipo = this.form.get('tipo') as FormControl;
  ctrlpreco = this.form.get('preco') as FormControl;

  estados: any[] = [];
  cidades: any[] = [];

  folder = EFolderUpload.anuncio;
  urlsFotos$ = new BehaviorSubject<string[]>([]);

  loadingUpload = false;

  filesCtrl = new FormControl();
  fotos$= new BehaviorSubject<string[]>([]);
  
  constructor(
    public dialogRef: MatDialogRef<AdminAnuncioEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _formBuilder: FormBuilder,
    public uploadService: UploadService,
    private storeService: StoreService,
    private utils: UtilsService,
    public core: CoreService

  ) {
  }


  async ngOnInit(): Promise<void> {

  
    this.editor = new Editor();
    this.utils.getLocalidades().subscribe((res: any) => {
      this.estados = res?.estados;
      setTimeout(() => {
        this.form.patchValue({ end_uf: 'MA' })
      }, 500)
    })

    if(this.data){
      this.form.patchValue({...this.data});

      const paths = this.form.value.fotos?.filter(elem => elem) ?? [];

      for (let index = 0; index < paths.length; index++) {
        const path = paths[index];
        await this.getFotos(path)
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
      if(!c?.length){return;}
      this.upload(c);
    });

  }



  async upload(files: File[]){
    this.loadingUpload = true;
    let fotos = this.form.value.fotos ?? [];
    fotos = fotos.filter(elem => elem);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const res = await this.uploadService.uploadIMG(file);
      if(res){
        fotos.push(res);
        this.getFotos(res)


      }
    }

    this.loadingUpload = false;
    this.form.patchValue({fotos})


  }

  async getFotos(path: string){
    const fullPath = await this.uploadService.getFoto(path, 'anuncios');
    const nvs = [...this.fotos$.value, fullPath];
    this.fotos$.next(nvs)
  }

  remove(index: number){
    if(!this.form.value.fotos){return}
    const fotos = this.form.value.fotos.filter((_, i) => i != index);
    this.form.patchValue({fotos});
    this.fotos$.next(this.fotos$.value.filter((_, i) => i != index));
  }

  salvar(){
    const item = {...this.form.value, url: this.createUrl()};
    let action: MyAction;

    console.log(item);
    

    return;
    if(item.id){
      action = {group:EGroup.Anuncio, action: EAction.UpdateOne, props: {item}}

    }else{
      action = {group:EGroup.Anuncio, action: EAction.SetOne, props: {item}}
    }

    const result$ = this.storeService.dispatchAction(action)
    result$.pipe(first()).subscribe(res => {
      this.utils.showMessage(res?.props?.message);

      if(!res.props?.error){
       this.dialogRef.close();
      }
      
    })
  }
  
  createUrl(){
    const titulo = String(this.form.value.titulo).toLocaleLowerCase();
    const cidade = String(this.form.value.end_cidade).toLocaleLowerCase();
    const uf = String(this.form.value.end_uf).toLocaleLowerCase();
    const preco = String('valor de R$' + this.form.value.preco).toLocaleLowerCase();
    const codigo = String('código '+ this.form.value.codigo).toLocaleLowerCase();
    const categoria = String('interessados em ' + this.form.value.categoria).toLocaleLowerCase();
    const bairro =  this.form.value.end_bairro ? String('no bairro ' + this.form.value.end_bairro).toLocaleLowerCase() : '';
    const tipo =  String(this.form.value.tipo).toLocaleLowerCase();
    let result = `${titulo} ${cidade} ${uf} ${bairro} ${categoria} ${tipo} ${preco} ${codigo}`;
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

    return result;

  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


}
