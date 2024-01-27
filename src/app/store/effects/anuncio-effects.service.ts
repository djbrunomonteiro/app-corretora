import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs';
import { IResponse } from '../../models/response';
import { StoreService } from '../../services/store.service';
import { getAction, EGroup, EAction, appActions, IAction } from '../app.actions';
import { UtilsService } from '../../services/utils.service';
import { AnuncioService } from '../../services/anuncio.service';

@Injectable({
  providedIn: 'root'
})
export class AnuncioEffectsService {

  constructor(
    private actions$: Actions,
    private utils: UtilsService,
    private storeService: StoreService,
    private anuncioService: AnuncioService
  ) { }

  getAll = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Anuncio, EAction.GetAll)),
      switchMap(() => {
        return this.anuncioService.getAll().pipe(
          map((res: IResponse) => {
            console.log('resss', res);

            if (res.status === 200) {
              const itens = this.utils.paramsJsonParse(res.results) as any[]
              this.storeService.dispatchAction({ group: EGroup.Anuncio, action: EAction.SetAllStore, props: { itens } })
            }
            return res;
          }),
        )
      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Anuncio, action: EAction.GetAllError, props: { error: res?.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Anuncio, action: EAction.GetAllSucess, props: { error: res?.error, message: res?.message } })
        }
      })
    )
  );

  addOne = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Anuncio, EAction.SetOne)),
      switchMap((action: IAction) => {
        let item = action?.props?.item as any;
        return this.anuncioService.addOne(item).pipe(
          map((res: IResponse) => {
            console.log('res add', res);

            if (res.status === 200 || res.status === 201) {
              item = this.utils.paramsJsonParse(res.results)
              this.storeService.dispatchAction({ group: EGroup.Anuncio, action: EAction.SetOneStore, props: { item } })
            }
            return res;
          }),
        )

      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Anuncio, action: EAction.SetOneError, props: { status: res.status, error: res.error, message: res?.message } })
        } else {
          return appActions({ group: EGroup.Anuncio, action: EAction.SetOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
        }
      })
    )
  );


  //   getOne = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(getAction(EGroup.Tanque, EAction.GetOne)),
  //     switchMap((action: IAction) => {
  //       const id = action.params?.id;
  //       return this.tanqueService.getOne(id).pipe(
  //         map((res: IResponse) => {
  //           if (res.status === 200 || res.status === 201) {
  //             const item = this.utils.paramsJsonParse(res.results)
  //             this.storeService.dispatchAction({ group: EGroup.Tanque, action: EAction.SetOneStore, props: { item } })
  //           }
  //           console.log(res);

  //           return res;
  //         }),
  //       )
  //     }),
  //     map((res: IResponse) => {
  //       if (res.error) {
  //         return appActions({ group: EGroup.Tanque, action: EAction.GetOneError, props: {status: res.status, error: res.error, message: res?.message } })
  //       } else {
  //         return appActions({ group: EGroup.Tanque, action: EAction.GetOneSucess, props: {status: res.status, error: res.error, message: res?.message } })
  //       }
  //     })
  //   )
  // );



  updateOne = createEffect(() =>
    this.actions$.pipe(
      ofType(getAction(EGroup.Anuncio, EAction.UpdateOne)),
      switchMap((action: IAction) => {
        const item = action?.props?.item;
        return this.anuncioService.updateOne(item).pipe(
          map((res: IResponse) => {
            console.log('RESULT UPDATE', res);

            if (res.status === 200 || res.status === 201) {
              const item = this.utils.paramsJsonParse(res.results)
              this.storeService.dispatchAction({ group: EGroup.Anuncio, action: EAction.SetOneStore, props: { item } })
            }
            return res;
          }),
        )

      }),
      map((res: IResponse) => {
        if (res.error) {
          return appActions({ group: EGroup.Anuncio, action: EAction.UpdateOneError, props: { status: res.status, error: res.error, message: res?.message } })
        } else {
          console.log('existe rror', res.error);
          return appActions({ group: EGroup.Anuncio, action: EAction.UpdateOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
        }
      })
    )
  );

  deleteOne = createEffect(() =>
  this.actions$.pipe(
    ofType(getAction(EGroup.Anuncio, EAction.DeleteOne)),
    switchMap((action: IAction) => {
      const id = action?.params?.id as any;
      return this.anuncioService.deleteOne(id).pipe(
        map((res: IResponse) => {
          if (res.status === 200 || res.status === 201) {
            this.storeService.dispatchAction({ group: EGroup.Anuncio, action: EAction.DeleteOneStore, props: { id } })
          }
          return res;
        }),
      )

    }),
    map((res: IResponse) => {
      if (res.error) {
        return appActions({ group: EGroup.Anuncio, action: EAction.DeleteOneError, props: { status: res.status, error: res.error, message: res?.message } })
      } else {
        return appActions({ group: EGroup.Anuncio, action: EAction.DeleteOneSucess, props: { status: res.status, error: res.error, message: res?.message } })
      }
    })
  )
);
}