import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs';
import { IResponse } from '../../models/response';
import { StoreService } from '../../services/store.service';
import { getAction, EGroup, EAction, appActions, IAction } from '../app.actions';
import { UtilsService } from '../../services/utils.service';
import { LeadService } from '../../services/lead.service';

@Injectable({
  providedIn: 'root'
})
export class LeadEffectsService {

  constructor(
    private actions$: Actions,
    private utils: UtilsService,
    private storeService: StoreService,
    private leadService: LeadService
  ) { }

  getAll = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Lead, EAction.GetAll)),
      switchMap(() => {
        return this.leadService.getAll().pipe(
          map((res: IResponse) => {
            if (res.status === 200) {
              const itens = this.utils.paramsJsonParse(res.results) as any[]
              this.storeService.dispatchAction({ group: EGroup.Lead, action: EAction.SetAllStore, props: { itens } })
            }
            return res;
          }),
        )
      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Lead, action: EAction.GetAllError, props: { error: res?.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Lead, action: EAction.GetAllSucess, props: { error: res?.error, message: res?.message } })
        }
      })
    )
  );

  addOne = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Lead, EAction.SetOne)),
      switchMap((action: IAction) => {
        let item = action?.props?.item as any;
        return this.leadService.addOne(item).pipe(
          map((res: IResponse) => {
            if (res.status === 200 || res.status === 201) {
              item = this.utils.paramsJsonParse(res.results)
              this.storeService.dispatchAction({ group: EGroup.Lead, action: EAction.SetOneStore, props: { item } })
            }
            return res;
          }),
        )

      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Lead, action: EAction.SetOneError, props: { status: res.status, error: res.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Lead, action: EAction.SetOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
        }
      })
    )
  );


  updateOne = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Lead, EAction.UpdateOne)),
      switchMap((action: IAction) => {
        const item = action?.props?.item;
        return this.leadService.updateOne(item).pipe(
          map((res: IResponse) => {
            console.log('RESULT UPDATE', res);

            if (res.status === 200 || res.status === 201) {
              const item = this.utils.paramsJsonParse(res.results)
              this.storeService.dispatchAction({ group: EGroup.Lead, action: EAction.SetOneStore, props: { item } })
            }
            return res;
          }),
        )

      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Lead, action: EAction.UpdateOneError, props: { status: res.status, error: res.error, message: res?.message } })
        } else {
          console.log('existe rror', res.error);
          return appActions({ group: EGroup.Lead, action: EAction.UpdateOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
        }
      })
    )
  );

  deleteOne = createEffect(() =>
  this.actions$.pipe(
    ofType(getAction(EGroup.Lead, EAction.DeleteOne)),
    switchMap((action: IAction) => {
      const id = action?.params?.id as any;
      return this.leadService.deleteOne(id).pipe(
        map((res: IResponse) => {
          if (res.status === 200 || res.status === 201) {
            this.storeService.dispatchAction({ group: EGroup.Lead, action: EAction.DeleteOneStore, props: { id } })
          }
          return res;
        }),
      )

    }),
    map((res: IResponse) => {
      if (res.error) {
        return appActions({ group: EGroup.Lead, action: EAction.DeleteOneError, props: { status: res.status, error: res.error, message: res?.message } })
      } else {
        return appActions({ group: EGroup.Lead, action: EAction.DeleteOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
      }
    })
  )
);
}