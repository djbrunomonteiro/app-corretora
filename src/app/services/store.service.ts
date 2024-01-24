import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EAction, IAction, MyAction, appActions, getAction } from '../store/app.actions';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private store: Store,
    private actions$: Actions
  ) { }

  dispatchAction(myAction: MyAction): Observable<IAction> {
    const action = appActions(myAction);
    if (String(action.type).includes('Store')) {
      this.store.dispatch(action);
      return of(); // para actions que salvam apenas no Store
    } else {
      const typeS = myAction.action + 'Sucess' as EAction;
      const typeE = myAction.action + 'Error' as EAction;
      const success = getAction(myAction.group, typeS);
      const error = getAction(myAction.group, typeE);
      this.store.dispatch(action);

      return this.actions$.pipe(ofType(success, error));
    }
  }


    select<K>(mapFn: (state: object) => K) {
      return this.store.select(mapFn);
    }
}


