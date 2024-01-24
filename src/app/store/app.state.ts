import { ActionReducerMap } from '@ngrx/store';
import { actionsReducer } from './app.reducers';

export const appReducers: ActionReducerMap<any> = {
    userState: actionsReducer.UserReducer,
    anuncioState: actionsReducer.AnuncioReducer,
}