import { Injectable } from '@angular/core';
import { IEdmsDocumentType } from '../../model/model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from '../environment/loading.service';
import { HttpConfigService } from '../http/http-config.service';

@Injectable()
export class EdmsService {
  constructor(
    private httpClient: HttpClient,
    private httpConfigService: HttpConfigService,
    private loadingService: LoadingService
  ) {}

  getDocumentTypes(
    callback: (documentTypes: Array<IEdmsDocumentType>) => void,
    errorCallback?: (error: string) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .get<Array<IEdmsDocumentType>>(
        'api/Edms/GetDocumentTypes',
        this.httpConfigService.getOptions
      )
      .subscribe(
        result => {
          completed();
          callback(result);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          completed();
          console.error(httpErrorResponse.message);
          if (errorCallback) {
            errorCallback(httpErrorResponse.message);
          }
        }
      );
  }
}
