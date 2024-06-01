
import { Observable, firstValueFrom} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { removeEntity, setEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { computed, inject } from "@angular/core";
import { UtilsService } from "../services/utils.service";
import { IResponse } from "../models/response";
import { CoreService } from "../services/core.service";
import { IAgendamento } from '../models/agendamento';
import { AgendamentoService } from '../services/agendamento.service';

export interface AgendamentoState {
  entities: IAgendamento[];
  isLoading: boolean
};

export const initialState: AgendamentoState = {
  entities: [],
  isLoading: false,
};


export const AgendamentosStore = signalStore(
    { providedIn: 'root' },
    withDevtools('agendamentos'),
    withState(initialState),
    withEntities({ entity: type<IAgendamento>() }),
    withComputed(({ entities }) => ({
      allItens: computed(() => entities())
    })),
  
    withMethods((store, agendamentoService = inject(AgendamentoService), utils = inject(UtilsService), core = inject(CoreService)) => {
  
      function loadAll(idCliente?: string) {
        patchState(store, { isLoading: true });
        return agendamentoService.getAll(idCliente).pipe(
          tapResponse({
            next: (res: any) => {
              const { results } = res;
              let agendamentos = results as IAgendamento[];
              agendamentos = utils.ordenarItens(agendamentos, 'created_at')
              patchState(store, setEntities(agendamentos));
              patchState(store, { isLoading: false });
            },
            error: console.error,
          })
        ).subscribe()
  
      };
  
  
      function saveOne(agendamento: IAgendamento | Partial<IAgendamento>) {
        let response$: Observable<IResponse>;
  
        if (agendamento.id) {
          response$ = agendamentoService.updateOne(agendamento);
        } else {
          response$ = agendamentoService.addOne(agendamento);
        }
  
        const result$: Observable<IResponse> = response$.pipe(
          tapResponse({
            next: (response: IResponse) => {
              const { results } = response;
              let agendamentos = results as IAgendamento;
              patchState(store, setEntity(agendamentos));
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
        const result$: Observable<IResponse> = agendamentoService.deleteOne(id).pipe(
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
        return computed(() => store.allItens().filter(elem => elem.id === id)[0])
      }
  
      return { 
        loadAll, 
        saveOne, 
        removeOne,
        selectOne
      }
  
    },
  
  
  
  
    ));