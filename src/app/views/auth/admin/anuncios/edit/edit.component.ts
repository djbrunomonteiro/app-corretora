import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UtilsService } from '../../../../../services/utils.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { ImageDropzoneComponent } from '../../../../../shared/image-dropzone/image-dropzone.component';
import { EFolderUpload } from '../../../../../enums/folders';
import { BehaviorSubject } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { UploadService } from '../../../../../services/upload.service';
import { UrlFotosPipe } from '../../../../../pipes/url-fotos.pipe';

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
    UrlFotosPipe
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
export class AdminAnuncioEditComponent implements OnInit, AfterViewInit {

  form = this._formBuilder.group({
    id: [''],
    titulo: [''],
    descricao: [''],
    codigo: [''],
    categoria: [''],
    tipo: [''],
    preco: [''],
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
    end_uf: [''],
    end_cidade: [''],
    end_bairro: [''],
    end_logradouro: [''],
    end_numero: [''],
    end_complemento: [''],
    created_at: ['']
  });

  categorias = [
    'comprar',
    'alugar',
    'trocar'
  ];

  tipos = ['apartamento', 'casa' , 'casa de vila', 'casa de condomínio','Lançamentos casas', 'Lançamentos apartamentos', 'cobertura', 'duplex', 'flat', 'galpão', 'hotel', 'imóvel de recreação', 'loja', 'kitnets', 'restaurante', 'sítio', 'sala comercial', 'sobrado', 'chácara', 'terreno/lotes']
  areasComuns = [
    "Portaria",
    "Hall de entrada",
    "Áreas de circulação",
    "Elevadores",
    "Salão de festas",
    "Churrasqueira",
    "Piscina",
    "Quadra poliesportiva",
    "Playground",
    "Espaço gourmet",
    "Espaço fitness",
    "Espaço pet",
    "Lavanderia compartilhada",
    "Garagem",
    "Salão de jogos",
    "Sala de cinema",
    "Espaço coworking",
    "Espaço para eventos",
    "Espaço para festas infantil"
   ];

   areasImovel = [
    "Sala de estar",
    "Sala de jantar",
    "Cozinha",
    "Lavanderia",
    "Banheiros",
    "Quartos",
    "Varanda",
    "Quintal",
    "Sacada",
    "Terraço",
    "Área de serviço",
    "Escritório",
    "Home office",
    "Closet",
    "Despensa",
    "Garagem"
  ];

  itensProximos = [
    "Parque",
    "Praça",
    "Jardim",
    "Escola",
    "Hospital",
    "Supermercado",
    "Banco",
    "Restaurante",
    "Lojas",
    "Transporte público",
    "Vias de acesso",
    "Centro comercial",
    "Pontos turísticos"
  ];

  itensAdicionais = [
    "Depósito",
    "Guarita",
    "Manobrista",
    "Portão eletrônico",
    "Alarme",
    "Sistema de câmeras",
    "Piscina aquecida",
    "Churrasqueira a gás",
    "Jardim",
    "Horta",
    "Vista privilegiada",
    "Arquitetura moderna",
    "Decoração de alto padrão",
    "Imóvel reformado",
    "Imóvel novo",
    "Imóvel com potencial de valorização"
  ];

  nums: number[] = [];

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  estados: any[] = [];
  cidades: any[] = [];

  folder = EFolderUpload.anuncio;
  urlsFotos$ = new BehaviorSubject<string[]>([]);

  loadingUpload = false;

  filesCtrl = new FormControl();
  novos$= new BehaviorSubject<string[]>([]);
  
  constructor(
    public dialogRef: MatDialogRef<AdminAnuncioEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _formBuilder: FormBuilder,
    private utils: UtilsService,
    public uploadService: UploadService

  ) {
    this.generateNums();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.utils.getLocalidades().subscribe((res: any) => {
      this.estados = res?.estados;
      setTimeout(() => {
        this.form.patchValue({ end_uf: 'MA' })
      }, 500)
    })
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
      
    })
  }

  generateNums(){
    for (let index = 0; index <= 100; index++) {
      this.nums.push(index)
    }

  }

  async upload(files: File[]){
    this.loadingUpload = true;
    let fotos = this.form.value.fotos ?? [];
    fotos = fotos.filter(elem => elem);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const res = await this.uploadService.uploadStorage(file);
      const fullPath = await this.uploadService.getFoto(res, 'anuncios');
      if(res){
        fotos.push(res);
        const nvs = [...this.novos$.value, fullPath];
        console.log('nvs', nvs);
        
        this.novos$.next(nvs)
      }
    }

    this.loadingUpload = false;
    this.form.patchValue({fotos})

    console.log('fotos', fotos);
    


  }


}
