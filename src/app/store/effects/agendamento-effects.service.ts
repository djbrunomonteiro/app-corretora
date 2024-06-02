import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs';
import { IResponse } from '../../models/response';
import { AgendamentoService } from '../../services/agendamento.service';
import { StoreService } from '../../services/store.service';
import { UtilsService } from '../../services/utils.service';
import { getAction, EGroup, EAction, appActions, IAction } from '../app.actions';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoEffectsService {

  constructor(
    private actions$: Actions,
    private utils: UtilsService,
    private storeService: StoreService,
    private agendamentoService: AgendamentoService
  ) { }

  getAll = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Agendamento, EAction.GetAll)),
      switchMap((action: IAction) => {
        const id_cliente = action.params?.id;
        return this.agendamentoService.getAll(id_cliente).pipe(
          map((res: IResponse) => {
            if (res.status === 200) {
              const itens = this.utils.paramsJsonParse(res.results) as any[]
              this.storeService.dispatchAction({ group: EGroup.Agendamento, action: EAction.SetAllStore, props: { itens } })
            }
            return res;
          }),
        )
      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Agendamento, action: EAction.GetAllError, props: { error: res?.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Agendamento, action: EAction.GetAllSucess, props: { error: res?.error, message: res?.message } })
        }
      })
    )
  );

  addOne = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Agendamento, EAction.SetOne)),
      switchMap((action: IAction) => {
        let item = action?.props?.item as any;
        return this.agendamentoService.addOne(item).pipe(
          map((res: IResponse) => {
            if (res.status === 200 || res.status === 201) {
              item = this.utils.paramsJsonParse(res.results)
              this.storeService.dispatchAction({ group: EGroup.Agendamento, action: EAction.SetOneStore, props: { item } })
            }
            return res;
          }),
        )

      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Agendamento, action: EAction.SetOneError, props: { status: res.status, error: res.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Agendamento, action: EAction.SetOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
        }
      })
    )
  );


  updateOne = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Agendamento, EAction.UpdateOne)),
      switchMap((action: IAction) => {
        const item = action?.props?.item;
        return this.agendamentoService.updateOne(item).pipe(
          map((res: IResponse) => {
            if (res.status === 200 || res.status === 201) {
              const item = this.utils.paramsJsonParse(res.results)
              this.storeService.dispatchAction({ group: EGroup.Agendamento, action: EAction.SetOneStore, props: { item } })
            }
            return res;
          }),
        )

      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Agendamento, action: EAction.UpdateOneError, props: { status: res.status, error: res.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Agendamento, action: EAction.UpdateOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
        }
      })
    )
  );

  deleteOne = createEffect(() =>
  this.actions$.pipe(
    ofType(getAction(EGroup.Agendamento, EAction.DeleteOne)),
    switchMap((action: IAction) => {
      const id = action?.params?.id as any;
      return this.agendamentoService.deleteOne(id).pipe(
        map((res: IResponse) => {
          if (res.status === 200 || res.status === 201) {
            this.storeService.dispatchAction({ group: EGroup.Agendamento, action: EAction.DeleteOneStore, props: { id } })
          }
          return res;
        }),
      )

    }),
    map((res: IResponse) => {
      if (res.error) {
        return appActions({ group: EGroup.Agendamento, action: EAction.DeleteOneError, props: { status: res.status, error: res.error, message: res?.message } })
      } else {
        return appActions({ group: EGroup.Agendamento, action: EAction.DeleteOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
      }
    })
  )
);
}