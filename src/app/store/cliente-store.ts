import { ICliente } from "../models/cliente";
import { Observable, firstValueFrom} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { removeEntity, setEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { computed, inject } from "@angular/core";
import { UtilsService } from "../services/utils.service";
import { IResponse } from "../models/response";
import { CoreService } from "../services/core.service";
import { ClienteService } from "../services/cliente.service";

export interface ClienteState {
  entities: ICliente[];
  isLoading: boolean
};

export const initialState: ClienteState = {
  entities: [],
  isLoading: false,
};


export const ClientesStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withDevtools('clientes'),
    withState(initialState),
    withEntities({ entity: type<ICliente>() }),
    withComputed(({ entities }) => ({
      allItens: computed(() => entities()),
      isAuth: computed(() => entities().filter(elem => elem.auth)[0]),
    })),
  
    withMethods((store, clienteService = inject(ClienteService), utils = inject(UtilsService), core = inject(CoreService)) => {
  
      function loadAll() {
        patchState(store, { isLoading: true });
        return clienteService.getAll().pipe(
          tapResponse({
            next: (res: any) => {
              const { results } = res;
              let clientes = results as ICliente[];
              clientes = utils.ordenarItens(clientes, 'created_at')
              patchState(store, setEntities(clientes));
              patchState(store, { isLoading: false });
            },
            error: console.error,
          })
        ).subscribe()
  
      };
  
  
      function saveOne(cliente: ICliente | Partial<ICliente>) {
        let response$: Observable<IResponse>;
  
        if (cliente.id) {
          response$ = clienteService.updateOne(cliente);
        } else {
          response$ = clienteService.addOne(cliente);
        }
  
        const result$: Observable<IResponse> = response$.pipe(
          tapResponse({
            next: (response: IResponse) => {
              const { results } = response;
              let clientes = results as ICliente;
              patchState(store, setEntity(clientes));
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
        const result$: Observable<IResponse> = clienteService.deleteOne(id).pipe(
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
  
      function selectOne(id: string) {
        return store.allItens().filter(elem => elem.id === id)[0]
      }

      return { 
        loadAll, 
        saveOne, 
        removeOne,
        selectOne,
      }
  
    },
  
  
  
  
    ));