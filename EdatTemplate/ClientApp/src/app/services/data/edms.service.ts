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
    callback: (metadatas: IEdmsDocument[]) => void,
    errorCallback?: (error: string) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<IEdmsDocument[]>(
        '/api/Edms/UploadFiles',
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
}
