import { Injectable } from '@angular/core';
import { IDocumentMetadata, IStringResponse } from '../../model/model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Injectable()
export class BlobService {
  constructor(private httpClient: HttpClient) {}

  list(
    directory: string,
    callback: (metadata: IDocumentMetadata[]) => void
  ): void {
    this.httpClient
      .get<IDocumentMetadata[]>(
        'api/Storage/GetFileList?directory=' + directory
      )
      .subscribe(result => {
        callback(result);
      });
  }

  get(id: string, fileName: string): void {
    this.httpClient
      .get<Blob>('api/Storage/GetFile?id=' + id, {
        responseType: 'blob' as 'json'
      })
      .subscribe(result => {
        saveAs(result, fileName);
      });
  }

  add(
    formData: FormData,
    callback: (metadatas: IDocumentMetadata[]) => void,
    errorCallback?: (error: string) => void
  ): void {
    this.httpClient
      .post<IDocumentMetadata[]>('/api/Storage/UploadFiles', formData)
      .subscribe(
        result => {
          callback(result);
        },
        (httpErrorResponse: HttpErrorResponse) => {
          console.error(httpErrorResponse.message);
          if (errorCallback) {
            errorCallback(httpErrorResponse.message);
          }
        }
      );
  }

  remove(id: string, callback: (response: string) => void): void {
    this.httpClient
      .post<IStringResponse>('api/Storage/RemoveFile', { data: id })
      .subscribe(result => {
        callback(result.data);
      });
  }

  removeAll(directory: string, callback: (response: string) => void): void {
    this.httpClient
      .post<IStringResponse>('api/Storage/RemoveFiles', { data: directory })
      .subscribe(result => {
        callback(result.data);
      });
  }
}
