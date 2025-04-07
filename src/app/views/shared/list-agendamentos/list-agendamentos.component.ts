import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, effect, inject } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClientesStore } from '../../../store/cliente-store';
import { AgendamentosStore } from '../../../store/agendamentos-store';

@Component({
    selector: 'app-list-agendamentos',
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

  clienteStore = inject(ClientesStore);
  agendamentoStore = inject(AgendamentosStore);

  displayedColumns: string[] = ['cliente', 'codigo', 'anuncio', 'dias', 'horas', 'status', 'acoes'];
  dataSource = new MatTableDataSource<any[]>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    ){
      effect(() => this.setDataTable())
    }

  ngOnInit(): void {
    this.getAgendamentos();
  }

  getAgendamentos(){
    const cliente = this.clienteStore.isAuth();
    if(!cliente){return;}
    this.agendamentoStore.loadAll(cliente.id);
  }

  setDataTable(){
    this.dataSource = new MatTableDataSource<any>(this.agendamentoStore.allItens());
    this.dataSource.paginator = this.paginator;
  }
}
