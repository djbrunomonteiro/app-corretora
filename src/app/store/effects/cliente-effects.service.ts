import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { switchMap, map } from 'rxjs';
import { IResponse } from '../../models/response';
import { StoreService } from '../../services/store.service';
import { UtilsService } from '../../services/utils.service';
import { getAction, EGroup, EAction, appActions, IAction } from '../app.actions';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteEffectsService {


  constructor(
    private actions$: Actions,
    private utils: UtilsService,
    private storeService: StoreService,
    private clienteService: ClienteService,
    private auth: AuthService
  ) { }

  getAll = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Cliente, EAction.GetAll)),
      switchMap(() => {
        return this.clienteService.getAll().pipe(
          map((res: IResponse) => {
            if (res.status === 200) {
              const itens = this.utils.paramsJsonParse(res.results) as any[]
              this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.SetAllStore, props: { itens } })
            }
            return res;
          }),
        )
      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Cliente, action: EAction.GetAllError, props: { error: res?.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Cliente, action: EAction.GetAllSucess, props: { error: res?.error, message: res?.message } })
        }
      })
    )
  );

  getOne = createEffect(() =>
  this.actions$.pipe(
    ofType(getAction(EGroup.Cliente, EAction.GetOne)),
    switchMap((action: IAction) => {
      const id = action?.params?.id ?? ''
      return this.clienteService.getOne(id).pipe(
        map((res: IResponse) => {
          if (res.status === 200) {
            const item = this.utils.paramsJsonParse(res.results) as any[]
            this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.SetOneStore, props: { item } })
          }
          return res;
        }),
      )
    }),
    map((res: IResponse) => {
      if (res.error) {
        return appActions({ group: EGroup.Cliente, action: EAction.GetOneError, props: { error: res?.error, message: res?.message } })
      } else {
        return appActions({ group: EGroup.Cliente, action: EAction.GetOneSucess, props: { error: res?.error, message: res?.message } })
      }
    })
  )
);

  addOne = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Cliente, EAction.SetOne)),
      switchMap((action: IAction) => {
        let item = action?.props?.item as any;
        return this.clienteService.addOne(item).pipe(
          map((res: IResponse) => {
            if (res.status === 200 || res.status === 201) {
              item = this.utils.paramsJsonParse(res.results);
              // if(!this.auth.userData$.value){item = {...item, auth: true}}
              this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.SetOneStore, props: { item } })
            }
            return res;
          }),
        )

      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Cliente, action: EAction.SetOneError, props: {item: undefined, status: res.status, error: res.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Cliente, action: EAction.SetOneSucess, props: {item: res.results, status: res.status, error: res.error, message: res?.message } })
        }
      })
    )
  );


  updateOne = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Cliente, EAction.UpdateOne)),
      switchMap((action: IAction) => {
        let item = action?.props?.item;
        return this.clienteService.updateOne(item).pipe(
          map((res: IResponse) => {
            if (res.status === 200 || res.status === 201) {
              item = this.utils.paramsJsonParse(res.results);
              this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.SetOneStore, props: { item } })
            }
            return res;
          }),
        )

      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Cliente, action: EAction.UpdateOneError, props: { status: res.status, error: res.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Cliente, action: EAction.UpdateOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
        }
      })
    )
  );

  deleteOne = createEffect(() =>
  this.actions$.pipe(
    ofType(getAction(EGroup.Cliente, EAction.DeleteOne)),
    switchMap((action: IAction) => {
      const id = action?.params?.id as any;
      return this.clienteService.deleteOne(id).pipe(
        map((res: IResponse) => {
          if (res.status === 200 || res.status === 201) {
            this.storeService.dispatchAction({ group: EGroup.Cliente, action: EAction.DeleteOneStore, props: { id } })
          }
          return res;
        }),
      )

    }),
    map((res: IResponse) => {
      if (res.error) {
        return appActions({ group: EGroup.Cliente, action: EAction.DeleteOneError, props: { status: res.status, error: res.error, message: res?.message } })
      } else {
        return appActions({ group: EGroup.Cliente, action: EAction.DeleteOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
      }
    })
  )
);
}