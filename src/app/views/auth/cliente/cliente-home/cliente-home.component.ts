import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../../modules/material/material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreService } from '../../../../services/core.service';
import { StoreService } from '../../../../services/store.service';
import { UtilsService } from '../../../../services/utils.service';
import { DropzoneCdkModule } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { UrlFotosPipe } from '../../../../pipes/url-fotos.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ClienteLoginComponent } from '../cliente-login/cliente-login.component';
import { EGroup, EAction } from '../../../../store/app.actions';

@Component({
  selector: 'app-cliente-home',
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
  templateUrl: './cliente-home.component.html',
  styleUrl: './cliente-home.component.scss'
})
export class ClienteHomeComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private storeService: StoreService,
    private utils: UtilsService,
    public core: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,

  ) { }

  showFiller = false;

  ngOnInit(): void {


    const url = this.activatedRoute.snapshot.paramMap.get('url');
    if (url) {
      this.checkAuth(url)
    } else {
      console.log('aquiii');
      this.openLogin();
    }

  }

  openLogin(item?: string) {
    const dialogRef = this.dialog.open(ClienteLoginComponent, { disableClose: true, data: item, minWidth: 1000, minHeight: 700 });
    dialogRef.afterClosed().subscribe(cliente => {
      if (!cliente) { this.router.navigate(['/']) }
      this.setClienteAuth(cliente)
    });
  }

  checkAuth(url: string) {


  }

  getDados(id: string) {
    console.log(id);

  }

  setClienteAuth(item: any) {
    if (!item) { return }
    this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.SetOneStore, props: { item } });
    this.router.navigate([`/auth/cliente/${item.id}`]);
  }

}
