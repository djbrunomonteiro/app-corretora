import { Pipe, PipeTransform, inject } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { StoreService } from '../services/store.service';
import { isFavorito } from '../store/selectors/cliente.selector';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientesStore } from '../store/cliente-store';

@Pipe({
  name: 'isFavorito$',
  standalone: true
})
export class FavoritoPipe implements PipeTransform {

  clienteStore = inject(ClientesStore);

  transform(id: string): Observable<boolean> {
    let result = new BehaviorSubject(false)
    const cliente = this.clienteStore.isAuth();
    if(cliente){
      const favoritos = cliente.favoritos as any[] ?? [];
      const existe = favoritos.includes(id)
      result.next(existe)
    }else{
      result.next(false)
    }

    return result

  }

}
