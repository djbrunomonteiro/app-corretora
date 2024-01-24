import { Action} from '@ngrx/store';
import { ActionReducer, MetaReducer } from '@ngrx/store';

export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state: any, action: Action): any {
    if (action.type === 'CLEAR_STATE') {
      state = undefined;
    }
    return reducer(state, action);
  };

}
export const metaReducers: MetaReducer<any>[] = [clearState];