import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderDataService {

  private currentUserData = new Subject<any>();

  setState(state: any) {
    this.currentUserData.next(state);
  }

  getState(): Observable<any> {
    return this.currentUserData.asObservable();
  }
}