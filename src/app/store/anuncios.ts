import { IAnuncio } from "../models/anuncio";
import { Observable, delay, firstValueFrom, lastValueFrom, of, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { setEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from "@angular/core";
import { AnuncioService } from "../services/anuncio.service";
import { ESlides } from "../enums/slides";
import { UtilsService } from "../services/utils.service";
import { IResponse } from "../models/response";
import { log } from "console";


export interface AnuncioState {
  entities: IAnuncio[];
  isLoading: boolean
};

export const initialState: AnuncioState = {
  entities: [],
  isLoading: false,
};

export const AnunciosStore = signalStore(
  { providedIn: 'root' },
  withDevtools('anuncios'),
  withState(initialState),
  withEntities({ entity: type<IAnuncio>() }),
  withComputed(({ entities }) => ({
    allItens: computed(() => entities())
  })),

  withMethods((store, anuncioService = inject(AnuncioService), utils = inject(UtilsService)) => {
    
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

    function selectItensSlider(tipo: ESlides, start = 0, end = 8) {
      return computed(() => {
        let result = store.allItens();
        result = utils.ordenarItens(result, 'created_at');
        result = result.filter((elem, i) => String(elem.tipo).includes(tipo) && i >= start && i <= end);
        return result;
      })
    }




    return { selectItensSlider, loadAll, saveOne }



  },




  ));