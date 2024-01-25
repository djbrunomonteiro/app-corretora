import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UtilsService } from '../../../../../services/utils.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class AdminAnuncioEditComponent implements OnInit, AfterViewInit {

  form = this._formBuilder.group({
    id: [''],
    titulo:[''],
    descricao: [''],
    codigo:[''],
    categoria :[''],
    tipo:[''],
    preco:[''],
    iptu:[''],
    condominio:[''],
    area_util:[''],
    qtd_suite:[''],
    qtd_dorm:[''],
    qtd_ban:[''],
    qtd_vaga:[''],
    dets_imovel:[''],
    dets_area_comum:[''],
    dets_proximidades:[''],
    dets_outros:[''],
    fotos:[''],
    tour_virtual:[''],
    end_cep: [''],
    end_uf :[''],
    end_cidade :[''],
    end_bairro :[''],
    end_logradouro :[''],
    end_numero :[''],
    end_complemento :[''],
    created_at :['']
  })


  foods: any[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  estados: any[] = [];
  cidades: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AdminAnuncioEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _formBuilder: FormBuilder,
    private utils: UtilsService

  ){}

  ngOnInit(): void {
    console.log(this.data);
    this.utils.getLocalidades().subscribe((res: any) =>{
      this.estados = res?.estados;
      setTimeout(() => {
        this.form.patchValue({end_uf: 'MA'})
      },500)
    })
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(c => {
      if(c?.end_uf){
        this.cidades = this.estados.filter((elem: any) => elem?.sigla === c.end_uf).map((elem: any) => elem.cidades)[0] ?? [];
        setTimeout(() => {
          if(c?.end_uf === 'MA'){
            this.form.patchValue({end_cidade: 'São Luís'})
          }
        },500)
      }
    })
  }


}
