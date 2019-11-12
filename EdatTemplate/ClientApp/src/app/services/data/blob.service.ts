import { Injectable } from '@angular/core';
import { IDocumentMetadata, IStringResponse } from '../../model/model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { LoadingService } from '../environment/loading.service';

@Injectable()
export class BlobService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  list(
    directory: string,
    callback: (metadata: IDocumentMetadata[]) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .get<IDocumentMetadata[]>(
        'api/Storage/GetFileList?directory=' + directory,
        {
          headers: {
            'ng-api-call': 'true',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: 'Sat, 01 Jan 2019 00:00:00 GMT'
          }
        }
      )
      .subscribe(
        result => {
          callback(result);
          completed();
        },
        () => {
          completed();
        }
      );
  }

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
          saveAs(result, fileName);
          completed();
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
      .post<IDocumentMetadata[]>('/api/Storage/UploadFiles', formData, {
        headers: {
          'ng-api-call': 'true',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: 'Sat, 01 Jan 2019 00:00:00 GMT'
        }
      })
      .subscribe(
        result => {
          callback(result);
          completed();
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse.message);
          if (errorCallback) {
            errorCallback(httpErrorResponse.message);
          }
          completed();
        }
      );
  }

  remove(id: string, callback: (response: string) => void): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<IStringResponse>(
        'api/Storage/RemoveFile',
        { data: id },
        {
          headers: {
            'ng-api-call': 'true',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: 'Sat, 01 Jan 2019 00:00:00 GMT'
          }
        }
      )
      .subscribe(
        result => {
          callback(result.data);
          completed();
        },
        () => {
          completed();
        }
      );
  }

  removeAll(directory: string, callback: (response: string) => void): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<IStringResponse>(
        'api/Storage/RemoveFiles',
        { data: directory },
        {
          headers: {
            'ng-api-call': 'true',
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: 'Sat, 01 Jan 2019 00:00:00 GMT'
          }
        }
      )
      .subscribe(
        result => {
          callback(result.data);
          completed();
        },
        () => {
          completed();
        }
      );
  }
}
