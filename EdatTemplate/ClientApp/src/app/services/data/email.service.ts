import { Injectable } from '@angular/core';
import { IEmailMessage } from '../../model/model';
import { LoadingService } from '../environment/loading.service';
import { HttpService } from '../http/http.service';

@Injectable()
export class EmailService {
  constructor(
    private httpService: HttpService,
    private loadingService: LoadingService
  ) {}

  send(
    emailMessage: IEmailMessage,
    callback?: (result: boolean) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpService.post<IEmailMessage, boolean>(
      'api/Email/Send',
      emailMessage,
      result => {
        completed();
        if (callback) {
          callback(result);
        }
      },
      () => {
        completed();
      }
    );
  }
}
