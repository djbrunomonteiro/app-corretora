
import { Observable, firstValueFrom} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { removeEntity, setEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { computed, inject } from "@angular/core";
import { UtilsService } from "../services/utils.service";
import { IResponse } from "../models/response";
import { CoreService } from "../services/core.service";
import { ILead } from "../models/lead";
import { LeadService } from "../services/lead.service";

export interface LeadState {
  entities: ILead[];
  isLoading: boolean
};

export const initialState: LeadState = {
  entities: [],
  isLoading: false,
};


export const LeadsStore = signalStore(
    { providedIn: 'root', protectedState: false },
    withState(initialState),
    withEntities({ entity: type<ILead>() }),
    withComputed(({ entities }) => ({
      allItens: computed(() => entities())
    })),
  
    withMethods((store, leadService = inject(LeadService), utils = inject(UtilsService), core = inject(CoreService)) => {
      function loadAll() {
        patchState(store, { isLoading: true });
        return leadService.getAll().pipe(
          tapResponse({
            next: (res: any) => {
              const { results } = res;
              let leads = results as ILead[];
              leads = utils.ordenarItens(leads, 'created_at')
              patchState(store, setEntities(leads));
              patchState(store, { isLoading: false });
            },
            error: console.error,
          })
        ).subscribe()
  
      };
  
  
      function saveOne(lead: ILead | Partial<ILead>) {
        let response$: Observable<IResponse>;
        patchState(store,  {isLoading: true});
  
        if (lead.id) {
          response$ = leadService.updateOne(lead);
        } else {
          response$ = leadService.addOne(lead);
        }
  
        const result$: Observable<IResponse> = response$.pipe(
          tapResponse({
            next: (response: IResponse) => {
              const { results } = response;
              let leads = results as ILead;
              patchState(store, setEntity(leads));
              patchState(store,  {isLoading: false});
              return response
            },
            error: (err: any) => {
              console.error(err);
              patchState(store,  {isLoading: false});
              return { status: err?.status ?? 400, error: true, message: err?.message }
            },
          }
          )
        )
        return firstValueFrom(result$)
      }
  
      function removeOne(id: string) {
        const result$: Observable<IResponse> = leadService.deleteOne(id).pipe(
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