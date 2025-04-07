import { CommonModule } from '@angular/common';
import { Component, effect, inject, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { CoreService } from '../../../services/core.service';
import { UtilsService } from '../../../services/utils.service';
import { ClientesStore } from '../../../store/cliente-store';
import { LeadsStore } from '../../../store/leads-store';
import { LeadService } from '../../../services/lead.service';

@Component({
    selector: 'app-form-desbloquear-preco',
    imports: [
        MaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        RecaptchaModule
    ],
    templateUrl: './form-desbloquear-preco.component.html',
    styleUrl: './form-desbloquear-preco.component.scss'
})
export class FormDesbloquearPrecoComponent {

  anuncio: any;

  form = this.fb.group({
    id_anuncio: [''],
    id_cliente: [''],
    nome: ['', Validators.required],
    whatsapp: ['', Validators.required],
    email: [''],
    mensagem: [''],
    horarios: [''],
    status: ['aberto'],
    historico: [[]],
  });

  clienteStore = inject(ClientesStore);
  leadStore = inject(LeadsStore);
  leadService = inject(LeadService);
  loading = false;

  showRecaptcha = true;
  keyRecaptcha = environment.recaptcha;

  constructor(
    public dialogRef: MatDialogRef<FormDesbloquearPrecoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils: UtilsService,
    public core: CoreService,
    private fb: FormBuilder,

  ) {
  }


  ngOnInit(): void {
    this.anuncio = this.data?.anuncio;
    this.leadService.checkCollectedContact();
    const cliente = this.clienteStore.isAuth()

    if(cliente){
      this.form.patchValue({
        id_anuncio: this.anuncio.id,
        id_cliente: cliente.id,
        nome: cliente.nome,
        whatsapp: cliente.whatsapp,
        email: cliente.email,
      })
    }
  }


  async salvar() {
    this.loading = true;
    let item: any;
    item = {...this.form.value}
    const result = await this.leadStore.saveOne(item);
    const {error} = result;
    this.loading = true;
    this.utils.showMessage('Visualização de preço desbloqueada!', undefined, {duration: 5000});
    if(error){return}
    localStorage.setItem('telmamonteiro_collectedContact', 'true');
    this.leadService.checkCollectedContact();
    this.dialogRef.close();
  }

  resolved(captchaResponse: any) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    if(!captchaResponse){return}
    this.showRecaptcha = false;
  }



}

