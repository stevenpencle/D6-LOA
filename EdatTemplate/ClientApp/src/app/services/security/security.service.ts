import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IClientToken } from '../../model/model';
import { Store } from '../store/store.service';
import { Observable } from 'rxjs';

@Injectable()
export class SecurityService extends Store<IClientToken> {
  token$: Observable<IClientToken>;

  constructor(private httpClient: HttpClient) {
    super('SecurityService', null);
  }

  getToken(callback?: () => void): void {
    const state = this.getState();
    if (state !== undefined && state !== null) {
      return;
    }
    this.httpClient.get<IClientToken>('api/security/gettoken').subscribe(
      result => {
        this.setState(result);
        this.token$ = this.state$;
        if (callback) {
          callback();
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === 401) {
          this.setState(null);
          this.token$ = this.state$;
          if (callback) {
            callback();
          }
        }
      }
    );
  }

  removeToken(): void {
    this.setState(null);
    this.token$ = this.state$;
  }
}
