import { Injectable } from '@angular/core';
import {
  IDocumentMetadata,
  IStringResponse,
  IStringRequest
} from '../../model/model';
import { saveAs } from 'file-saver';
import { LoadingService } from '../environment/loading.service';
import { HttpService } from '../http/http.service';

@Injectable()
export class BlobService {
  constructor(
    private httpService: HttpService,
    private loadingService: LoadingService
  ) {}

  list(
    directory: string,
    callback: (metadata: IDocumentMetadata[]) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpService.get<IDocumentMetadata[]>(
      'api/Storage/GetFileList?directory=' + directory,
      result => {
        completed();
        callback(result);
      },
      () => {
        completed();
      }
    );
  }

  get(id: string, fileName: string): void {
    const completed = this.loadingService.show();
    this.httpService.getWithBlobResponse(
      'api/Storage/GetFile?id=' + id,
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
    this.httpService.post<FormData, IDocumentMetadata[]>(
      'api/Storage/UploadFiles',
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

  remove(id: string, callback: (response: string) => void): void {
    const completed = this.loadingService.show();
    this.httpService.post<IStringRequest, IStringResponse>(
      'api/Storage/RemoveFile',
      { data: id },
      result => {
        completed();
        callback(result.data);
      },
      () => {
        completed();
      }
    );
  }

  removeAll(directory: string, callback: (response: string) => void): void {
    const completed = this.loadingService.show();
    this.httpService.post<IStringRequest, IStringResponse>(
      'api/Storage/RemoveFiles',
      { data: directory },
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
