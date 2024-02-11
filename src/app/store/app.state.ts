import { ActionReducerMap } from '@ngrx/store';
import { actionsReducer } from './app.reducers';

export const appReducers: ActionReducerMap<any> = {
    userState: actionsReducer.UserReducer,
    anuncioState: actionsReducer.AnuncioReducer,
    leadState: actionsReducer.LeadReducer,
    clienteState: actionsReducer.ClienteReducer,
    agendamentoState: actionsReducer.AgendamentoReducer,
    
}