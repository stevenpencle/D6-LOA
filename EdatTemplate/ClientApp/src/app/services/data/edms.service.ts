import { Injectable } from '@angular/core';
import { IEdmsDocument } from '../../model/model';
import { LoadingService } from '../environment/loading.service';
import { HttpService } from '../http/http.service';

@Injectable()
export class EdmsService {
  constructor(
    private httpService: HttpService,
    private loadingService: LoadingService
  ) {}

  add(
    formData: FormData,
    callback: (metadata: IEdmsDocument) => void,
    errorCallback?: (error: string) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpService.post<FormData, IEdmsDocument>(
      'api/Edms/AddDocument',
      formData,
      result => {
        completed();
        callback(result);
      },
      errors => {
        completed();
        if (errorCallback) {
          errorCallback(errors.list());
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
    this.httpService.post<FormData, IEdmsDocument>(
      'api/Edms/AddDocumentVersion',
      formData,
      result => {
        completed();
        callback(result);
      },
      errors => {
        completed();
        if (errorCallback) {
          errorCallback(errors.list());
        }
      }
    );
  }

  get(id: number, fileName: string): void {
    const completed = this.loadingService.show();
    this.httpService.getBlobResponse(
      'api/Edms/GetDocument?id=' + id,
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
