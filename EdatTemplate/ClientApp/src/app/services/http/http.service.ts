import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../services/environment/environment.service';
import { Router } from '@angular/router';
import { SecurityService } from '../security/security.service';
import { IClientToken } from '../../model/model';
import { DataMarshalerService } from '../data/data-marshaler.service';

@Injectable()
export class HttpService implements OnDestroy {
  private token: IClientToken = null;

  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService,
    private securityService: SecurityService,
    private dataMarshalerService: DataMarshalerService,
    private router: Router
  ) {
    this.securityService.safeSubscribe(
      this,
      token => {
        this.token = token;
      },
      () => {
        this.securityService.getToken();
      }
    );
  }

  ngOnDestroy(): void {}

  get<TResult>(
    api: string,
    callback: (result: TResult) => void,
    modelStateErrorCallback?: (errors: string) => void
  ): void {
    this.httpClient
      .get<TResult>(this.environmentService.baseUrl + api, {
        headers: {
          'ng-api-call': 'true'
        }
      })
      .subscribe(
        result => {
          callback(result);
        },
        (error: HttpErrorResponse) => {
          const errors = this.handleError(error);
          if (modelStateErrorCallback) {
            modelStateErrorCallback(errors);
          }
        }
      );
  }

  post<TPayload, TResult>(
    api: string,
    payload: TPayload,
    callback: (result: TResult) => void,
    modelStateErrorCallback?: (errors: string) => void
  ): void {
    this.httpClient
      .post<TResult>(this.environmentService.baseUrl + api, payload, {
        headers: {
          'ng-api-call': 'true'
        }
      })
      .subscribe(
        result => {
          callback(result);
        },
        (error: HttpErrorResponse) => {
          const errors = this.handleError(error);
          if (modelStateErrorCallback) {
            modelStateErrorCallback(errors);
          }
        }
      );
  }

  private handleError(httpErrorResponse: HttpErrorResponse): string {
    const applicationError = httpErrorResponse.headers.get('Application-Error');
    if (applicationError) {
      throw applicationError;
    }
    if (httpErrorResponse.status === 500) {
      this.dataMarshalerService.load(httpErrorResponse.error);
      this.router.navigateByUrl('/server-error');
    }
    let modelStateErrorsConsole = '';
    let modelStateErrors = '';
    if (httpErrorResponse.status === 400) {
      for (const property in httpErrorResponse.error) {
        httpErrorResponse.error[property].forEach((error: string) => {
          modelStateErrorsConsole += error + '\n';
          modelStateErrors += '<li>' + error + '</li>';
        });
      }
    }
    if (httpErrorResponse.status === 401) {
      this.securityService.removeToken();
      this.router.navigateByUrl('/');
    }
    if (httpErrorResponse.status === 403) {
      if (this.token == null) {
        window.location.replace('security/adlogin');
      } else {
        this.router.navigateByUrl('/not-authorized');
      }
    }
    modelStateErrors = modelStateErrors == '' ? null : modelStateErrors;
    console.error(modelStateErrorsConsole || 'Server error');
    if (!modelStateErrors) {
      modelStateErrors = '<li>Unexpected Server Exception</li>';
    }
    return '<ul>' + modelStateErrors + '</ul>';
  }
}
