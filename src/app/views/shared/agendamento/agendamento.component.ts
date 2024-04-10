import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CoreService } from '../../../services/core.service';
import { StoreService } from '../../../services/store.service';
import { UtilsService } from '../../../services/utils.service';
import { FormContatoComponent } from '../form-contato/form-contato.component';
import { ClienteService } from '../../../services/cliente.service';
import { ClienteLoginComponent } from '../../auth/cliente/cliente-login/cliente-login.component';
import { EClientetemplate } from '../../../enums/clientetemplate';
import { EAction, EGroup } from '../../../store/app.actions';
import { first } from 'rxjs';

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
    ClienteLoginComponent
  ],
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss'
})
export class AgendamentoComponent implements OnInit {

  anuncio: any;

  form = this.fb.group({
    id_anuncio: [''],
    id_cliente: [''],
    titulo_anuncio: [''],
    cod_anuncio: [''],
    nome_cliente: [''],
    dias: ['', Validators.required],
    horarios: ['', Validators.required],
    status: ['aberto'],
    historico: [[]],
  });

  loading = false;
  clienteTemplate = EClientetemplate

  

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
   
  }

  openLogin(item?: string, template = EClientetemplate.login) {
    const dialogRef = this.dialog.open(ClienteLoginComponent, { disableClose: true, data: {item, template}, minWidth: '50vw', height: '90vh' });
    dialogRef.afterClosed().pipe(first()).subscribe(cliente => {
      this.setClienteAuth(cliente)
    });
  }

  setClienteAuth(item: any) {
    if (!item) { return }
    this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.SetOneStore, props: { item } });
    localStorage.setItem('access_token', item.hash)

  }

  salvar(){
    this.loading = true;
    this.form.patchValue({
      id_anuncio: this.anuncio.id,
      id_cliente: this.clienteService.clienteAuth.id?? '',
      titulo_anuncio: this.anuncio.titulo ?? '',
      cod_anuncio: this.anuncio.codigo ?? '',
      nome_cliente: this.clienteService.clienteAuth.nome ?? '',
    });

    const item = {...this.form.value};
    const result$ = this.storeService.dispatchAction({ group: EGroup.Agendamento, action: EAction.SetOne, props: { item } });
    result$.pipe(first()).subscribe(res =>{
      this.utils.showMessage(res.props?.message, undefined, {duration: 5000});
      this.loading = false;
      if(!res.props?.error){
        this.dialogRef.close();

      }
    })
    
    
  }

}
