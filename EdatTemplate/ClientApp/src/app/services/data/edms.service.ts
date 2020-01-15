import { Injectable } from '@angular/core';
import { IEdmsDocument } from '../../model/model';
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

  add(
    formData: FormData,
    callback: (metadata: IEdmsDocument) => void,
    errorCallback?: (error: string) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<IEdmsDocument>(
        '/api/Edms/AddDocument',
        formData,
        this.httpConfigService.postOptions
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

  update(
    formData: FormData,
    callback: (metadata: IEdmsDocument) => void,
    errorCallback?: (error: string) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<IEdmsDocument>(
        '/api/Edms/AddDocumentVersion',
        formData,
        this.httpConfigService.postOptions
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

  get(id: number, fileName: string): void {
    const completed = this.loadingService.show();
    this.httpClient
      .get<Blob>('api/Edms/GetDocument?id=' + id, {
        responseType: 'blob' as 'json',
        headers: {
          'ng-api-call': 'true',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: 'Sat, 01 Jan 2020 00:00:00 GMT'
        }
      })
      .subscribe(
        result => {
          completed();
          saveAs(result, fileName);
        },
        () => {
          completed();
        }
      );
  }
}
