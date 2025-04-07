import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { StoreService } from '../../../services/store.service';
import { UtilsService } from '../../../services/utils.service';
import { ClienteLoginComponent } from '../../auth/cliente/cliente-login/cliente-login.component';
import { EClientetemplate } from '../../../enums/clientetemplate';
import { AdminClientesEditComponent } from '../../auth/cliente/edit/admin-clientes-edit.component';

@Component({
    selector: 'app-cliente-cadastro',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxMaskDirective,
        NgxMaskPipe,
        AdminClientesEditComponent
    ],
    templateUrl: './cliente-cadastro.component.html',
    styleUrl: './cliente-cadastro.component.scss'
})
export class ClienteCadastroComponent {

  @Output()templateEvent = new EventEmitter<EClientetemplate>();

  templateEmiter:EClientetemplate = EClientetemplate.login;
  
  form = this._formBuilder.group({
    cpf_cnpj: ['', Validators.required],
    data_nasc: ['', Validators.required],
  });

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  isCadastroPublic = true;

  constructor(
    public dialogRef: MatDialogRef<ClienteLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
  ) { }

  getResCadastro(res: any){
    if(!res?.id){return}
    this.dialogRef.close(res)
  }


}
