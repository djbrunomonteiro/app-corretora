import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../../../services/core.service';
import { StoreService } from '../../../services/store.service';
import { UtilsService } from '../../../services/utils.service';
import { EAction, EGroup } from '../../../store/app.actions';
import { BehaviorSubject, first } from 'rxjs';
import { ClienteService } from '../../../services/cliente.service';
import { ClienteIsAuth } from '../../../store/selectors/cliente.selector';

@Component({
  selector: 'app-form-contato',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
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
  })

  loading = false;

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
    this.storeService.select(ClienteIsAuth).subscribe(res => {
      if(res){
        this.form.patchValue({
          id_anuncio: this.anuncio.id,
          id_cliente: res.id,
          nome: res.nome,
          whatsapp: res.whatsapp,
          email: res.email,
        })
      }
    });

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

  salvar() {
    this.loading = true;
    let item: any;

    let horarios = this.checkHorarios?.opts?.filter((elem: any) => elem.completed).map((elem: any )=> elem.name);
    horarios = horarios.length ? horarios : ['Manhã', 'Tarde']
    item = {...item, horarios}

    item = this.form.value;

    const result$ = this.storeService.dispatchAction({ group: EGroup.Lead, action: EAction.SetOne, props: { item } })
    result$.pipe(first()).subscribe(act =>{
      this.utils.showMessage(act.props?.message, undefined, {duration: 5000});
      this.loading = true;
      if(!act.props?.error){
        this.dialogRef.close();
      }
    })


  }



}
