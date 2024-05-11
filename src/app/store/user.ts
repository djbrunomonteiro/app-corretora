import { IAnuncio } from "../models/anuncio";
import { delay, exhaustMap, switchMap} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { setEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { computed, inject } from "@angular/core";
import { AnuncioService } from "../services/anuncio.service";

type UserState = {
    entities: any[]; 
    isLoading: boolean
};

export const initialState: UserState = {
    entities:[],
    isLoading: false,
};

export const UserStore = signalStore(
    { providedIn: 'root' },
    withDevtools('user'),
    withState(initialState), 
    withEntities({ entity: type<any>()}),
    withComputed(({entities}) => ({
        user: computed(() => entities()[0])
    }))
  );