import { Platform } from '@angular/cdk/platform';
import { HttpClient } from '@angular/common/http';
import { HostListener, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {Clipboard} from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  url: string = 'assets/estados-cidades-br.json';
  widthSize = new BehaviorSubject<number>(0);
  heigthSize = new BehaviorSubject<number>(0);


  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private clipboard: Clipboard,
    @Inject(PLATFORM_ID) public platformId: Object,
  ) { }

  copyText(txt: string = '') {
    if(!txt){return}
    this.clipboard.copy(txt);
    this.showMessage('Copiado para a área de transferência', 'X', {horizontalPosition: 'center', verticalPosition: 'top', duration: 3000});

  }

  openLinkInNewTab(url: string) {
    if(isPlatformBrowser(this.platformId)){
      window.open(url,'_blank');

    }
  }
  showMessage(message: string = '', action: string = 'X', config: MatSnackBarConfig = {horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000}){
    this._snackBar.open(message, action, config);
  }

  filenameCreate(pre: any = '', pos: any = '') {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';

    for (let i = 0; i < 30; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indiceAleatorio);
    }

    return resultado;
  }

  getLocalidades(): Observable<{}> {
    return this.http.get(this.url)
  }

  paramsJsonParse(itemRef: any[] | object): any[] | object {
    let result;
    if (!itemRef) { return itemRef; };
    if (Array.isArray(itemRef)) {
      result = itemRef.map(elem => this.checkParamIsJson(elem));
    } else if (typeof (itemRef) === 'object') {
      result = this.checkParamIsJson(itemRef);
    } else {
      return itemRef;
    }

    return result;

  }

  checkParamIsJson(item: any) {
    for (const key in item) {
      if (this.validJsonStr(item[key])) {
        item[key] = JSON.parse(item[key]);
      }
    }
    return item;
  }

  validJsonStr(str: any) {
    if (str === null || str === 'null') return false;
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  ordenarItens(arrayRef: Array<any>, param: string, tipo?: string) {
    //tipo: crescente e decrescente
    let result: any[];
    if (tipo) {
      switch (tipo) {
        case 'cresc':
          result = arrayRef.sort((a, b) => {
            if (a[param] > b[param]) {
              return 1;
            }
            if (a[param] < b[param]) {
              return -1;
            }
            return 0;
          });
          break;
        default:
          result = arrayRef.sort((a, b) => {
            if (a[param] < b[param]) {
              return 1;
            }
            if (a[param] > b[param]) {
              return -1;
            }
            return 0;
          });
          break;
      }

    } else {
      result = arrayRef.sort((a, b) => {
        if (a[param] < b[param]) {
          return 1;
        }
        if (a[param] > b[param]) {
          return -1;
        }
        return 0;
      });
    }

    return result;
  };

}
