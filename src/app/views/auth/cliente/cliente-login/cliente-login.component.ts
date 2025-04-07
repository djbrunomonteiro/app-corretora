import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../../modules/material/material.module';
import { ClienteService } from '../../../../services/cliente.service';
import { UtilsService } from '../../../../services/utils.service';
import { StoreService } from '../../../../services/store.service';
import { AuthService } from '../../../../services/auth.service';
import { EClientetemplate } from '../../../../enums/clientetemplate';
import { ClienteCadastroComponent } from '../../../shared/cliente-cadastro/cliente-cadastro.component';

@Component({
    selector: 'app-cliente-login',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxMaskDirective,
        NgxMaskPipe,
        ClienteCadastroComponent
    ],
    templateUrl: './cliente-login.component.html',
    styleUrl: './cliente-login.component.scss'
})
export class ClienteLoginComponent implements OnInit{

  form = this._formBuilder.group({
    cpf_cnpj: ['', Validators.required],
    data_nasc: ['', Validators.required],
  });

  template: EClientetemplate = EClientetemplate.login;
  EClientetemplate = EClientetemplate;

  constructor(
    public dialogRef: MatDialogRef<ClienteLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _formBuilder: FormBuilder,
    private auth: AuthService,
    private utils: UtilsService,
  ) { 
  }
  ngOnInit(): void {
    if(this.data?.template){
      this.ctrlTemplate(this.data.template)
    }

  }

  async login() {
    if (this.form.invalid) { return }
    const {error, message, results} = await this.auth.authLogin(this.form.value.cpf_cnpj, this.form.value.data_nasc);
    this.utils.showMessage(message);
    if (error) {return }
    this.dialogRef.close(results);

  }

  ctrlTemplate(temp: EClientetemplate){
    this.template = temp;
  }

  async cadastrar() {
    const res = await this.auth.authLogin(this.form.value.cpf_cnpj, this.form.value.data_nasc);
    this.utils.showMessage(res.message);
    if (!res.error) {
      this.dialogRef.close(res.results);
    }

  }

}
