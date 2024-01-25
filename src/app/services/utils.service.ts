import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  url: string = 'assets/estados-cidades-br.json';

  constructor(
    private http: HttpClient,
  ) { }

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
