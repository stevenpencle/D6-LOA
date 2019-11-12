import { Injectable } from '@angular/core';
import { IEmailMessage } from '../../model/model';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../environment/loading.service';

@Injectable()
export class EmailService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  send(
    emailMessage: IEmailMessage,
    callback?: (result: boolean) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient.post<boolean>('api/Email/Send', emailMessage).subscribe(
      result => {
        if (callback) {
          callback(result);
        }
        completed();
      },
      () => {
        completed();
      }
    );
  }
}
