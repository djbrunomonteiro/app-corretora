import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  url: string = 'assets/estados-cidades-br.json';

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  // showMessage(message: string = '', action: string = 'X', config: MatSnackBarConfig = {horizontalPosition: 'center', verticalPosition: 'bottom', duration: 3000}){
  //   this._snackBar.open(message, action, config);
  // }

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
