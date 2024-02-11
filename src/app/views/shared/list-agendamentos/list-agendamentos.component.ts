import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, first } from 'rxjs';
import { StoreService } from '../../../services/store.service';
import { AllAnuncios } from '../../../store/selectors/anuncio.selector';
import { ClienteService } from '../../../services/cliente.service';
import { userData } from '../../../store/selectors/user.selector';
import { EAction, EGroup } from '../../../store/app.actions';
import { AllAgendamentos } from '../../../store/selectors/agendamento.selector';

@Component({
  selector: 'app-list-agendamentos',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    UrlFotosPipe,
    FavoritoPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './list-agendamentos.component.html',
  styleUrl: './list-agendamentos.component.scss'
})
export class ListAgendamentosComponent {

  displayedColumns: string[] = ['cliente', 'codigo', 'anuncio', 'dias', 'horas', 'status', 'acoes'];
  dataSource = new MatTableDataSource<any[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  agendamentos$!: Observable<any[]>

  constructor(
    private storeService: StoreService,
    private clienteService: ClienteService,
    ){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getAgendamentos();
  }

  getAgendamentos(){
    console.log(this.clienteService.clienteAuth);
    let id = this.clienteService.clienteAuth.id;
    const result$ = this.storeService.dispatchAction({group:EGroup.Agendamento, action: EAction.GetAll, params: {id}});
    result$.pipe(first()).subscribe(res => {

    })

    this.agendamentos$ = this.storeService.select(AllAgendamentos);
    this.agendamentos$.subscribe(res => {
      console.log('res', res);
      this.dataSource = new MatTableDataSource<any[]>(res); 

    } )


    

  }


  
}
