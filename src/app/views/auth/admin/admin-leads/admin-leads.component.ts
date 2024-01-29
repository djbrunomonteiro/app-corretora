import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, first } from 'rxjs';
import { StoreService } from '../../../../services/store.service';
import { UtilsService } from '../../../../services/utils.service';
import { AlertConfirmComponent } from '../../../../shared/alert-confirm/alert-confirm.component';
import { EGroup, EAction } from '../../../../store/app.actions';
import { AllAnuncios } from '../../../../store/selectors/anuncio.selector';
import { AdminAnuncioEditComponent } from '../anuncios/edit/edit.component';
import { AllLeads } from '../../../../store/selectors/lead.selector';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../modules/material/material.module';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AdminLeadEditComponent } from '../admin-lead-edit/admin-lead-edit.component';

@Component({
  selector: 'app-admin-leads',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AdminLeadEditComponent
  ],
  templateUrl: './admin-leads.component.html',
  styleUrl: './admin-leads.component.scss'
})
export class AdminLeadsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['tipo', 'nome', 'mensagem','whatsapp', 'horarios', 'created', 'status','acoes'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  leads$!: Observable<any[]>

  constructor(
    private storeService: StoreService,
    public dialog: MatDialog,
    private utils: UtilsService
  ){}

  ngOnInit(): void {
    this.getItens();
    // this.openEdit()

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getItens(){
    const result$ = this.storeService.dispatchAction({group: EGroup.Lead, action: EAction.GetAll});
    result$.pipe(first()).subscribe((r) =>{
      console.log('chamouu ?', r);
      
      this.leads$ = this.storeService.select(AllLeads);
      this.leads$.subscribe(res => {
        console.log('leads', res);
        
        if(res?.length){
          this.dataSource = new MatTableDataSource<any>(res); 
        }
      } )
    })

  }

  openEdit(item?: any){
    const dialogRef = this.dialog.open(AdminLeadEditComponent, {disableClose: true, data: item, minWidth: 1000, minHeight: 700} );
  }

  delete(id: string){
    const dialogRef = this.dialog.open(AlertConfirmComponent );
    dialogRef.afterClosed().pipe(first()).subscribe(res => {
      if(!res){return}

      const result$ = this.storeService.dispatchAction({group: EGroup.Lead, action: EAction.DeleteOne, params: {id}});
      result$.pipe(first()).subscribe((act) =>{
        this.utils.showMessage(act.props?.message)
      })
    });


  }




}
