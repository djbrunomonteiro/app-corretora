import * as fromAppReducer from '../app.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';
export const userState = createFeatureSelector<fromAppReducer.AppState>('userState');

export const userData = createSelector(
    userState,
    (elements) => {
        return
        const result = Object.values(elements.entities)[0];
        return result
    }
);