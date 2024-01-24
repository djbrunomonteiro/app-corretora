import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../modules/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

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
export class AdminAnuncioEditComponent implements OnInit {

  form = this._formBuilder.group({
    id: [''],
    codigo:[''],
    titulo:[''],
    categoria :[''],
    tipo:[''],
    fotos:[''],
    tour_virtual:[''],
    preco:[''],
    iptu:[''],
    condominio:[''],
    area_util:[''],
    qtd_dorm:[''],
    qtd_ban:[''],
    qtd_suite:[''],
    qtd_vaga:[''],
    dets_imovel:[''],
    dets_area_comun:[''],
    dets_proximidades:[''],
    dets_outros:[''],
    end_cidade :[''],
    end_uf :[''],
    end_logradouro :[''],
    end_numero :[''],
    end_bairro :[''],
    end_complemento :[''],
    created_at :['']
  })

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<AdminAnuncioEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _formBuilder: FormBuilder

  ){}

  ngOnInit(): void {
    console.log(this.data);
    
  }

}
