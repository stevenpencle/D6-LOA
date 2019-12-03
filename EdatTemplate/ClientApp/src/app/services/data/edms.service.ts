import { Injectable } from '@angular/core';
import { IDocumentMetadata, IStringResponse } from '../../model/model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { LoadingService } from '../environment/loading.service';
import { HttpConfigService } from '../http/http-config.service';

@Injectable()
export class EdmsService {
  constructor(
    private httpClient: HttpClient,
    private httpConfigService: HttpConfigService,
    private loadingService: LoadingService
  ) {}

  get(id: string, fileName: string): void {
    const completed = this.loadingService.show();
    this.httpClient
      .get<Blob>('api/Storage/GetFile?id=' + id, {
        responseType: 'blob' as 'json',
        headers: {
          'ng-api-call': 'true',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: 'Sat, 01 Jan 2019 00:00:00 GMT'
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

  add(
    formData: FormData,
    callback: (metadatas: IDocumentMetadata[]) => void,
    errorCallback?: (error: string) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<IDocumentMetadata[]>('/api/Storage/UploadFiles', formData, this.httpConfigService.postOptions)
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

  remove(id: string, callback: (response: string) => void): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<IStringResponse>('api/Storage/RemoveFile', { data: id }, this.httpConfigService.postOptions)
      .subscribe(
        result => {
          completed();
          callback(result.data);
        },
        () => {
          completed();
        }
      );
  }
}
