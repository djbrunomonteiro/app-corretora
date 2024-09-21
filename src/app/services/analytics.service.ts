import { inject, Injectable } from '@angular/core';
import { Analytics, logEvent  } from '@angular/fire/analytics';
import { xParams } from 'ngx-sharebuttons';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private analytics = inject(Analytics);

  constructor() { }

  setLog(name: string = 'view_item', params: any){
    logEvent(this.analytics, name, params);
  }
}
