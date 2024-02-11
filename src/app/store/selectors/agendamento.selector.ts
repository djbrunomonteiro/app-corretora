import * as fromAppReducer from '../app.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
export const agendamentoState = createFeatureSelector<fromAppReducer.AppState>('agendamentoState');

export const AllAgendamentos = createSelector(
    agendamentoState,
    (elements) => {
        const result = Object.values(elements.entities);
        
        
        return result
    }
);
