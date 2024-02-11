import * as fromAppReducer from '../app.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
export const leadState = createFeatureSelector<fromAppReducer.AppState>('leadState');

export const AllLeads = createSelector(
    leadState,
    (elements) => {
        const result = Object.values(elements.entities);
        
        
        return result
    }
);

export const OneLead = (url: string) => createSelector(
    AllLeads,
    (elements) => {
        const result = elements.filter(elem => elem.url === url)[0];
        return result
    }
);