import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IClientToken } from '../../model/model';
import { Store } from '../store.service';

@Injectable()
export class SecurityService extends Store<IClientToken> {
  constructor(private httpClient: HttpClient) {
    super('SecurityService', null);
  }

  getToken(callback?: () => void): void {
    this.httpClient.get<IClientToken>('api/security/gettoken').subscribe(
      result => {
        this.setState(result);
        if (callback) {
          callback();
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === 401) {
          this.setState(null);
          if (callback) {
            callback();
          }
        }
      }
    );
  }

  removeToken(): void {
    this.setState(null);
  }
}
