import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EnvironmentService } from '../../services/environment/environment.service';
import { Router } from '@angular/router';
import { SecurityService } from '../security/security.service';
import { IClientToken } from '../../model/model';
import { DataMarshalerService } from '../data/data-marshaler.service';
import { LoadingService } from '../environment/loading.service';
import { HttpConfigService } from './http-config.service';

export interface ModelStateValidation {
  property: string;
  validations: string[];
}

export class ModelStateValidations {
  validations: ModelStateValidation[] = [];

  list(): string {
    let errorList = '';
    if (this.validations == null || this.validations.length === 0) {
      return '<ul><li>Unexpected Server Exception</li></ul>';
    }
    this.validations.forEach((validation: ModelStateValidation) => {
      validation.validations.forEach((error: string) => {
        errorList += '<li>' + error + '</li>';
      });
    });
    return '<ul>' + errorList + '</ul>';
  }
}
@Injectable()
export class HttpService implements OnDestroy {
  private token: IClientToken = null;

  constructor(
    private httpClient: HttpClient,
    private environmentService: EnvironmentService,
    private securityService: SecurityService,
    private dataMarshalerService: DataMarshalerService,
    private router: Router,
    private loadingService: LoadingService,
    private httpConfigService: HttpConfigService
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
    modelStateErrorCallback?: (errors: ModelStateValidations) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .get<TResult>(
        this.environmentService.baseUrl + api,
        this.httpConfigService.getOptions
      )
      .subscribe(
        result => {
          completed();
          callback(result);
        },
        (error: HttpErrorResponse) => {
          completed();
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
    modelStateErrorCallback?: (errors: ModelStateValidations) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<TResult>(
        this.environmentService.baseUrl + api,
        payload,
        this.httpConfigService.postOptions
      )
      .subscribe(
        result => {
          completed();
          callback(result);
        },
        (error: HttpErrorResponse) => {
          completed();
          const errors = this.handleError(error);
          if (modelStateErrorCallback) {
            modelStateErrorCallback(errors);
          }
        }
      );
  }

  private handleError(
    httpErrorResponse: HttpErrorResponse
  ): ModelStateValidations {
    const applicationError = httpErrorResponse.headers.get('Application-Error');
    if (applicationError) {
      throw applicationError;
    }
    if (httpErrorResponse.status === 500) {
      this.dataMarshalerService.load(httpErrorResponse.error);
      this.router.navigateByUrl('/server-error');
    }
    let modelStateErrorsConsole = '';
    const modelStateValidations: ModelStateValidations = new ModelStateValidations();
    if (httpErrorResponse.status === 400) {
      for (const property in httpErrorResponse.error) {
        if (httpErrorResponse.error.hasOwnProperty(property)) {
          const modelStateValidation: ModelStateValidation = {
            property: property,
            validations: []
          };
          httpErrorResponse.error[property].forEach((error: string) => {
            modelStateErrorsConsole += error + '\n';
            modelStateValidation.validations.push(error);
          });
          modelStateValidations.validations.push(modelStateValidation);
        }
      }
    }
    if (httpErrorResponse.status === 401) {
      this.securityService.removeToken();
      this.router.navigateByUrl('/');
    }
    if (httpErrorResponse.status === 403) {
      if (this.token == null) {
        window.location.replace('security/adLogin');
      } else {
        this.router.navigateByUrl('/not-authorized');
      }
    }
    console.error(
      modelStateErrorsConsole === '' ? 'Server error' : modelStateErrorsConsole
    );
    return modelStateValidations;
  }
}
