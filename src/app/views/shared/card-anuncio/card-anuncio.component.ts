import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, effect, inject } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../modules/material/material.module';
import { FavoritoPipe } from '../../../pipes/favorito.pipe';
import { UrlFotosPipe } from '../../../pipes/url-fotos.pipe';
import { Router, NavigationExtras } from '@angular/router';
import { first } from 'rxjs';
import { ClienteService } from '../../../services/cliente.service';
import { CoreService } from '../../../services/core.service';
import { UtilsService } from '../../../services/utils.service';
import { ClientesStore } from '../../../store/cliente-store';
import { patchState } from '@ngrx/signals';
import { AnunciosStore } from '../../../store/anuncios-store';
import { LeadService } from '../../../services/lead.service';

@Component({
    selector: 'app-card-anuncio',
    imports: [
        MaterialModule,
        CommonModule,
        NgxMaskDirective,
        NgxMaskPipe,
        UrlFotosPipe,
        FavoritoPipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './card-anuncio.component.html',
    styleUrl: './card-anuncio.component.scss'
})
export class CardAnuncioComponent implements OnInit {

  @Input() item: any;

  clienteStore = inject(ClientesStore);
  anunciosStore = inject(AnunciosStore);
  leadService = inject(LeadService);
 
  constructor(
    public core: CoreService,
    private router: Router,
    private clienteService: ClienteService,
    private utils: UtilsService
  ){
  }
  ngOnInit(): void {
    this.leadService.checkCollectedContact();
  }

  goDetails(url: any){
    this.router.navigate([`/anuncios/${url}`]);
  }

  async addFavorito(id: string){
    let cliente = this.clienteStore.isAuth();
    if(!cliente){return}
    let favoritos = cliente.favoritos as any[] ?? []
    favoritos.push(id)
    cliente = {...cliente, favoritos}
    const result = await this.clienteStore.saveOne(cliente);
    const {message} = result
    this.utils.showMessage(message);
  }

  goFavorito(id: string){
    const queryParams = {tab: 'favorito', id} as NavigationExtras
    this.router.navigate([`auth/cliente/${this.clienteService.clienteAuth.id}`], {queryParams})
  }

}
