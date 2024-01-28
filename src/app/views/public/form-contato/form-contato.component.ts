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
export class FormContatoComponent implements OnInit, AfterViewInit {

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
  tipoForm = '';

  formFale = this.fb.group({
    id_anuncio: [''],
    id_cliente: [''],
    nome: ['', Validators.required],
    whatsapp: ['', Validators.required],
    email: ['', Validators.email],
    mensagem: [''],
    horarios: [[]]
  })

  formAgenda = this.fb.group({
    id_anuncio: [''],
    id_cliente: [''],
    nome: ['', Validators.required],
    whatsapp: ['', Validators.required],
    email: ['', Validators.email],
    dia_semana: ['', Validators.required],
    horario: ['', Validators.required]
  });

  isValid$ = new BehaviorSubject<boolean>(false);
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<FormContatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utils: UtilsService,
    private storeService: StoreService,
    public core: CoreService,
    private fb: FormBuilder

  ) {
  }


  ngOnInit(): void {
    console.log(this.data);

    this.anuncio = this.data?.anuncio;
    this.tipoForm = this.data.tipoForm;
    this.formAgenda.patchValue({id_anuncio: this.anuncio.id});
    this.formFale.patchValue({id_anuncio: this.anuncio.id});

  }

  ngAfterViewInit(): void {
    if (this.tipoForm === 'fale') {
      this.setAll(true);
      this.isValid$.next(this.formFale.valid);

      this.formFale.valueChanges.subscribe(_ =>{
        this.isValid$.next(this.formFale.valid);
      })
      
    }else{
      this.isValid$.next(this.formAgenda.valid);
      this.formAgenda.valueChanges.subscribe(_ =>{
        this.isValid$.next(this.formAgenda.valid);
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

  salvar() {
    this.loading = true;
    let item: any;
    switch (this.tipoForm) {
      case 'agenda':
        item = this.formAgenda.value;
        break
      default:
        item = this.formFale.value;

        let horarios = this.checkHorarios?.opts?.filter((elem: any) => elem.completed).map((elem: any )=> elem.name);
        horarios = horarios.length ? horarios : ['Manhã', 'Tarde']
        item = {...item, horarios}
        break;

    }

    item = {...item, tipo: this.tipoForm}

    const result$ = this.storeService.dispatchAction({ group: EGroup.Lead, action: EAction.SetOne, props: { item } })
    result$.pipe(first()).subscribe(act =>{
      this.utils.showMessage(act.props?.message);
      this.loading = true;
      if(!act.props?.error){
        this.dialogRef.close();
      }
    })


  }



}
