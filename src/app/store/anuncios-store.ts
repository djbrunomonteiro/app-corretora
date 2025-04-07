import { IAnuncio } from "../models/anuncio";
import { Observable, firstValueFrom} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { removeEntity, setEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { computed, inject } from "@angular/core";
import { AnuncioService } from "../services/anuncio.service";
import { ESlides } from "../enums/slides";
import { UtilsService } from "../services/utils.service";
import { IResponse } from "../models/response";
import { CoreService } from "../services/core.service";
import { ICliente } from "../models/cliente";

export interface AnuncioState {
  entities: IAnuncio[];
  isLoading: boolean
};

export const initialState: AnuncioState = {
  entities: [],
  isLoading: false,
};

export const AnunciosStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialState),
  withEntities({ entity: type<IAnuncio>() }),
  withComputed(({ entities }) => ({
    allItens: computed(() => entities())
  })),

  withMethods((store, anuncioService = inject(AnuncioService), utils = inject(UtilsService), core = inject(CoreService)) => {

    function loadAll() {
      patchState(store, { isLoading: true });
      return anuncioService.getAll().pipe(
        tapResponse({
          next: (res: any) => {
            const { results } = res;

            let anuncios = results as IAnuncio[];
            anuncios = utils.ordenarItens(anuncios, 'created_at')
            patchState(store, setEntities(anuncios));
            patchState(store, { isLoading: false });
          },
          error: console.error,
        })
      ).subscribe()
    };

    function loadOne(id:string) {
      patchState(store, { isLoading: true });
      return anuncioService.getOne(id).pipe(
        tapResponse({
          next: (res: any) => {
            const { results } = res;

            let anuncio = results as IAnuncio;
            patchState(store, setEntity(anuncio));
            patchState(store, { isLoading: false });
          },
          error: console.error,
        })
      )
    };


    function saveOne(anuncio: IAnuncio | Partial<IAnuncio>) {
      let response$: Observable<IResponse>;

      if (anuncio.id) {
        response$ = anuncioService.updateOne(anuncio);
      } else {
        response$ = anuncioService.addOne(anuncio);
      }

      const result$: Observable<IResponse> = response$.pipe(
        tapResponse({
          next: (response: IResponse) => {
            const { results } = response;
            let anuncios = results as IAnuncio;
            patchState(store, setEntity(anuncios));
            return response
          },
          error: (err: any) => {
            console.error(err);
            return { status: err?.status ?? 400, error: true, message: err?.message }
          },
        }
        )
      )
      return firstValueFrom(result$)
    }

    function removeOne(id: string) {
      const result$: Observable<IResponse> = anuncioService.deleteOne(id).pipe(
        tapResponse({
          next: (response: IResponse) => {
            const { error } = response;
            if (!error) {
              patchState(store, removeEntity(id));
            }
            return response
          },
          error: (err: any) => {
            console.error(err);
            return { status: err?.status ?? 400, error: true, message: err?.message }
          },
        }
        )
      )
      return firstValueFrom(result$)

    }

    function search(form: any, order: any = core.orders[core.orders.length - 1]) {
      return computed(() => {
        const allAnuncios = store.allItens();
        const { all, termo, categoria, tipo, preco_max, preco_min } = form;
        let results = allAnuncios;
        if (!all) {
          if (termo) {
            results = results.filter(elem =>
              String(elem.titulo).toLowerCase().includes(termo.toLowerCase()) ||
              String(elem.descricao).toLowerCase().includes(termo.toLowerCase()) ||
              String(elem.end_bairro).toLowerCase().includes(termo.toLowerCase()) ||
              String(elem.end_cidade).toLowerCase().includes(termo.toLowerCase()) ||
              String(elem.tipo).toLowerCase().includes(termo.toLowerCase()) ||
              String(elem.codigo).toLowerCase().includes(termo.toLowerCase())
            );
          }
  
          if (categoria) {
            results = results.filter(elem => elem.categoria === categoria);
          }
  
          if (tipo) {
            results = results.filter(elem => elem.tipo === tipo);
          }
  
          if (preco_max) {
            results = results.filter(elem => {
              const preco = Number(elem.preco) ?? 0;
              if (preco === 0) { return true };
              return  preco >= Number(preco_min) && preco <= Number(preco_max)
            });
  
          }

        }

        let paramOrder = {
          param: 'preco',
          order: 'cresc'
        };
        

        if(order === core.orders[1]){
          paramOrder = {...paramOrder, order: 'desc'}
        }

        if(order === core.orders[2]){
          paramOrder = {param: 'created_at', order: 'desc'}
        }

        if(order === core.orders[3]){
          paramOrder = {param: 'created_at', order: 'cresc'}
        }

        results = utils.ordenarItens(results, paramOrder.param, paramOrder.order)
        return  results;
      })
    }

    function selectItensSlider(tipo: ESlides, start = 0, end = 8) {
      return computed(() => {
        let result = store.allItens();
        result = utils.ordenarItens(result, 'created_at');
        result = result.filter((elem, i) => {
          const match1 = i >= start && i <= end;
          let match2 = true;
          if(elem.tipo !== ESlides.all){
            match2 = String(elem.tipo).includes(tipo)
          }
           return match1 && match2
        })
        return result;
      })
    }

    function selectUltimos(max = 10) {
      let result = store.allItens();
      result = utils.ordenarItens(result, 'created_at');
      result = result.filter((_, i) => i <= max);
      return result
    }

    function selectOne(key: string) {
      console.log(store.allItens());
      
      return store.allItens().filter(elem => elem.url === key || elem.id === key)[0]
    }

    function isFavorito(id: string, cliente: ICliente){
      if(!cliente){return false}
      const res = cliente.favoritos.includes(id);
      return res.length ? true : false
    }

    return { 
      loadAll, 
      loadOne,
      saveOne, 
      removeOne, 
      search, 
      selectItensSlider,
      selectOne,
      selectUltimos,
      isFavorito
    }

  },




  ));