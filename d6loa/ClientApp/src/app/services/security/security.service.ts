import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IClientToken } from '../../model/model';
import { Store } from '../store/store.service';
import { Observable } from 'rxjs';
import { LoadingService } from '../environment/loading.service';
import { HttpConfigService } from '../http/http-config.service';

@Injectable()
export class SecurityService extends Store<IClientToken> {
  token$: Observable<IClientToken>;

  constructor(
    private httpClient: HttpClient,
    private httpConfigService: HttpConfigService,
    private loadingService: LoadingService
  ) {
    super('SecurityService', null);
  }

  getToken(callback?: () => void): void {
    const state = this.getState();
    if (state !== undefined && state !== null) {
      return;
    }
    const completed = this.loadingService.show();
    this.httpClient
      .get<IClientToken>(
        'api/security/getToken',
        this.httpConfigService.getOptions()
      )
      .subscribe(
        result => {
          completed();
          this.setState(result);
          this.token$ = this.state$;
          if (callback) {
            callback();
          }
        },
        (httpErrorResponse: HttpErrorResponse) => {
          completed();
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
