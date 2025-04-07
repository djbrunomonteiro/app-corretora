import { LeadService } from './../../../services/lead.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, inject } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../../services/core.service';
import { StoreService } from '../../../services/store.service';
import { UtilsService } from '../../../services/utils.service';
import { EAction, EGroup } from '../../../store/app.actions';
import { first } from 'rxjs';
import { ClienteService } from '../../../services/cliente.service';
import { ClientesStore } from '../../../store/cliente-store';
import { LeadsStore } from '../../../store/leads-store';
import { environment } from '../../../../environments/environment';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
    selector: 'app-form-contato',
    imports: [
        MaterialModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe,
        RecaptchaModule
    ],
    templateUrl: './form-contato.component.html',
    styleUrl: './form-contato.component.scss'
})
export class FormContatoComponent implements OnInit {

  checkHorarios: any = {
    name: 'Todos',
    completed: false,
    color: 'primary',
    opts: [
      { name: 'Manhã', completed: false, color: 'primary' },
      { name: 'Tarde', completed: false, color: 'primary' },
      { name: 'Noite', completed: false, color: 'primary' },
    ],
  };

  allComplete: boolean = false;

  anuncio: any;


  form = this.fb.group({
    id_anuncio: [''],
    id_cliente: [''],
    nome: ['', Validators.required],
    whatsapp: ['', Validators.required],
    email: [''],
    mensagem: [''],
    horarios: ['', Validators.required],
    status: ['aberto'],
    historico: [[]],
  });

  clienteStore = inject(ClientesStore);
  leadStore = inject(LeadsStore);
  leadService = inject(LeadService)
  loading = false;

  showRecaptcha = true;
  keyRecaptcha = environment.recaptcha;

  constructor(
    public dialogRef: MatDialogRef<FormContatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils: UtilsService,
    private storeService: StoreService,
    public core: CoreService,
    private fb: FormBuilder,
    private clienteService: ClienteService

  ) {
  }


  ngOnInit(): void {
    this.anuncio = this.data?.anuncio;
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


  updateAllComplete() {
    this.allComplete = this.checkHorarios.subcheckHorarioss != null && this.checkHorarios.subcheckHorarioss.every((t: { completed: any; }) => t.completed);
  }

  someComplete(): boolean {
    if (this.checkHorarios.subcheckHorarioss == null) {
      return false;
    }
    return this.checkHorarios.subcheckHorarioss.filter((t: { completed: any; }) => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.checkHorarios.opts == null) {
      return;
    }
    this.checkHorarios.opts.forEach((t: { completed: boolean; }) => (t.completed = completed));
  }

  async salvar() {
    this.loading = true;
    let item: any;

    let horarios = this.checkHorarios?.opts?.filter((elem: any) => elem.completed).map((elem: any )=> elem.name);
    horarios = horarios.length ? horarios : ['Manhã', 'Tarde']
    item = {...this.form.value, horarios}

    const result = await this.leadStore.saveOne(item);
    const {error, message} = result;
    this.loading = true;
    this.utils.showMessage(message, undefined, {duration: 5000});
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
