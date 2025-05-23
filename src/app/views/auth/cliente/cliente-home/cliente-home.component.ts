import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, afterNextRender, inject } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../../modules/material/material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CoreService } from '../../../../services/core.service';
import { StoreService } from '../../../../services/store.service';
import { UtilsService } from '../../../../services/utils.service';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { UrlFotosPipe } from '../../../../pipes/url-fotos.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ClienteLoginComponent } from '../cliente-login/cliente-login.component';
import { EGroup, EAction } from '../../../../store/app.actions';
import { AuthService } from '../../../../services/auth.service';
import { ClienteIsAuth } from '../../../../store/selectors/cliente.selector';
import { UploadService } from '../../../../services/upload.service';
import { AdminClientesEditComponent } from '../edit/admin-clientes-edit.component';
import { UserStore } from '../../../../store/user-store';
import { patchState } from '@ngrx/signals';
import { setEntity } from '@ngrx/signals/entities';
import { ClientesStore } from '../../../../store/cliente-store';
import { ICliente } from '../../../../models/cliente';


@Component({
    selector: 'app-cliente-home',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxMaskDirective,
        NgxMaskPipe,
        DropzoneCdkModule,
        DropzoneMaterialModule,
        UrlFotosPipe,
        AdminClientesEditComponent
    ],
    templateUrl: './cliente-home.component.html',
    styleUrl: './cliente-home.component.scss'
})
export class ClienteHomeComponent implements OnInit, AfterViewInit {

  clienteStore = inject(ClientesStore);
  clienteRef!: ICliente;
  ignoreLoad = false;
  loadingUpload = false;
  filesCtrl = new FormControl();
  showFiller = false;
  queryParams:NavigationExtras = {};

  constructor(
    public auth: AuthService,
    public core: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private uploadService: UploadService

  ) {}


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(q => this.queryParams = q);
    if (this.ignoreLoad) {return}
    this.checkAuth()

  }

  ngAfterViewInit(): void {
    // this.filesCtrl.valueChanges.subscribe(c => {
    //   if (!c?.length) { return; }
    //   this.upload(c);
    // });

  }

  openLogin(item?: string) {
    const dialogRef = this.dialog.open(ClienteLoginComponent, { disableClose: true, data: item, minWidth: '50vw'});
    dialogRef.afterClosed().subscribe(cliente => {
      if (!cliente) { this.router.navigate(['/']) }
      this.setClienteAuth(cliente);
    });
  }

  async checkAuth() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      const isValid = await this.auth.existeHash(access_token);
      if (isValid.error) {
        this.openLogin();
      } else {
        const item = isValid.results;
        this.ignoreLoad = true;
        this.setClienteAuth({ ...item, auth: true })
      }

    } else {
      this.openLogin();
    }

  }

  checkIsToken() {
    return localStorage.getItem('token')
  }

  setClienteAuth(item: any) {
    if (!item) { return }
    patchState(this.clienteStore, setEntity(item))
    this.router.navigate([`/auth/cliente/${item.id}`], {queryParams: this.queryParams});
    localStorage.setItem('access_token', item.hash);
    this.clienteRef = this.clienteStore.isAuth();
  }

  // async upload(files: File[]){
  //   this.loadingUpload = true;
  //   for (let index = 0; index < files.length; index++) {
  //     const file = files[index];
  //     const res = await this.uploadService.uploadFILE(file);
  //     if(res){

  //     }
  //   }

  //   this.loadingUpload = false;

  // }


}
