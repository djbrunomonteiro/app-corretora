import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../../pipes/url-fotos.pipe';
import { ClienteService } from '../../../../services/cliente.service';
import { UtilsService } from '../../../../services/utils.service';
import { StoreService } from '../../../../services/store.service';
import { EGroup, EAction } from '../../../../store/app.actions';

@Component({
  selector: 'app-cliente-login',
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
  templateUrl: './cliente-login.component.html',
  styleUrl: './cliente-login.component.scss'
})
export class ClienteLoginComponent {

  form = this._formBuilder.group({
    cpf_cnpj: ['', Validators.required]
  })
  constructor(
    public dialogRef: MatDialogRef<ClienteLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private utils: UtilsService,
    private storeService: StoreService
  ){}

  async login(){
    if(!this.form.value.cpf_cnpj){return}
    console.log('reste login', this.form.value);
    
    const res = await this.clienteService.authLogin(this.form.value.cpf_cnpj);
    this.utils.showMessage(res.message);
    if(!res.error){
      this.dialogRef.close({...res.results, auth: true});

    }
    
  }



}
