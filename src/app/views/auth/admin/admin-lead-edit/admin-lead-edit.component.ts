import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../../modules/material/material.module';
import { Validators, FormControl, FormBuilder, FormsModule, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, first } from 'rxjs';
import { EFolderUpload } from '../../../../enums/folders';
import { CoreService } from '../../../../services/core.service';
import { StoreService } from '../../../../services/store.service';
import { UploadService } from '../../../../services/upload.service';
import { UtilsService } from '../../../../services/utils.service';
import { MyAction, EGroup, EAction } from '../../../../store/app.actions';
import { AdminAnuncioEditComponent } from '../anuncios/edit/edit.component';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { UrlFotosPipe } from '../../../../pipes/url-fotos.pipe';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepickerIntl } from '@angular/material/datepicker';

@Component({
  selector: 'app-admin-lead-edit',
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
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_LOCALE, useValue: 'pt-BR'
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    }
  ],
  templateUrl: './admin-lead-edit.component.html',
  styleUrl: './admin-lead-edit.component.scss'
})
export class AdminLeadEditComponent {

  form = this._formBuilder.group({
    id: [''],
    status: ['aberto'],
    tipo: [''],
    nome: [''],
    whatsapp: [''],
    email: [''],
    mensagem: [''],
    id_cliente: [''],
    id_anuncio: [''],
    dia_semana: [''],
    horarios: [''],
    historico: this._formBuilder.array([]),
    created_at: ['']
  });

  ctrlHistorico = this.form.get('historico') as FormArray;

  tipo_status = ['aberto', 'andamento', 'finalizado'];

  constructor(
    public dialogRef: MatDialogRef<AdminAnuncioEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private _formBuilder: FormBuilder,
    private utils: UtilsService,
    public uploadService: UploadService,
    private storeService: StoreService,
    public core: CoreService,

  ) {
  }

  async ngOnInit(): Promise<void> {
    if (this.data) {
      this.form.patchValue({ ...this.data });

      if (!this.data.historico?.length) {
        this.createHistorico();
      }else{
        for (let index = 0; index < this.data.historico.length; index++) {
          const elem = this.data.historico[index];
          const group = this._formBuilder.group({
            descricao: [elem?.descricao],
            date: [elem?.date]
          });

          this.createHistorico(group)
          
        }
      }

      console.log('value form', this.form.value);
      console.log('this.data', this.data);

    }
  }

  createHistorico(grupo?: FormGroup) {
    if(!grupo){
      grupo = this._formBuilder.group({
        descricao: [''],
        date: [new Date().toISOString()]
      })
    }

    this.ctrlHistorico.push(grupo)
  }

  removeHistorico(index: number) {
    this.ctrlHistorico.removeAt(index);
  }

  ngAfterViewInit(): void {
  }



  salvar() {
    const historico = this.ctrlHistorico.value.map((elem: any) => ({...elem, date: new Date(elem.date).toISOString()}))
    const item = {...this.form.value, historico};

    const result$ = this.storeService.dispatchAction({ group: EGroup.Lead, action: EAction.UpdateOne, props: { item }});
    result$.pipe(first()).subscribe(res => {
      this.utils.showMessage(res?.props?.message);
      if (!res.props?.error) {
        this.dialogRef.close();
      }
    })
  }

}