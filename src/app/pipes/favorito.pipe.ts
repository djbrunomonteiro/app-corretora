import { Pipe, PipeTransform } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { StoreService } from '../services/store.service';
import { isFavorito } from '../store/selectors/cliente.selector';
import { Observable } from 'rxjs';

@Pipe({
  name: 'isFavorito$',
  standalone: true
})
export class FavoritoPipe implements PipeTransform {

  constructor(
    private storeService: StoreService
    ){}

  transform(id: string): Observable<boolean> {
    return this.storeService.select(isFavorito(id))

  }

}
