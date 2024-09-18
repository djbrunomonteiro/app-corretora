import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CoreService } from '../../../services/core.service';
import { StoreService } from '../../../services/store.service';
import { UtilsService } from '../../../services/utils.service';
import { ClienteService } from '../../../services/cliente.service';
import { ClienteLoginComponent } from '../../auth/cliente/cliente-login/cliente-login.component';
import { EClientetemplate } from '../../../enums/clientetemplate';
import { EAction, EGroup } from '../../../store/app.actions';
import { first } from 'rxjs';
import { ClientesStore } from '../../../store/cliente-store';
import { AgendamentosStore } from '../../../store/agendamentos-store';
import { IAgendamento } from '../../../models/agendamento';
import { RecaptchaModule } from 'ng-recaptcha';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ClienteLoginComponent,
    RecaptchaModule
  ],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent implements OnInit {

  clienteStore = inject(ClientesStore);
  agendamentoStore = inject(AgendamentosStore);

  anuncio: any;

  form = this.fb.group({
    id_anuncio: [''],
    id_cliente: ['0'],
    titulo_anuncio: [''],
    cod_anuncio: [''],
    nome_cliente: [''],
    whatsapp: ['', Validators.required],
    email: [''],
    mensagem: [''],
    dias: ['', Validators.required],
    horarios: ['', Validators.required],
    status: ['aberto'],
    historico: [[]],
  });

  loading = false;
  clienteTemplate = EClientetemplate;

  showRecaptcha = true;
  keyRecaptcha = environment.recaptcha;

  

  constructor(
    public dialogRef: MatDialogRef<AgendamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils: UtilsService,
    private storeService: StoreService,
    public core: CoreService,
    private fb: FormBuilder,
    public clienteService: ClienteService,
    public dialog: MatDialog,

  ) {

  }
  ngOnInit(): void {
    this.anuncio = this.data?.anuncio;
    this.showRecaptcha = true

   
  }

  resolved(captchaResponse: any) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    if(!captchaResponse){return}
    this.showRecaptcha = false;
  }

  openLogin(item?: string, template = EClientetemplate.login) {
    const dialogRef = this.dialog.open(ClienteLoginComponent, { disableClose: true, data: {item, template}});
    dialogRef.afterClosed().pipe(first()).subscribe(cliente => {
      this.setClienteAuth(cliente)
    });
  }

  setClienteAuth(item: any) {
    if (!item) { return }
    localStorage.setItem('access_token', item.hash)

  }

  async salvar(){
    this.loading = true;
    this.form.patchValue({
      id_anuncio: this.anuncio.id,
      titulo_anuncio: this.anuncio.titulo ?? '',
      cod_anuncio: this.anuncio.codigo ?? '',
    });

    const item = {...this.form.value} as IAgendamento;
    const {error, message} = await this.agendamentoStore.saveOne(item);
    this.utils.showMessage(message, undefined, {duration: 5000});
    this.loading = false;
    if(error){return}
    this.dialogRef.close();
  }

}
