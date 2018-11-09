import { Injectable } from '@angular/core';
import { IEmailMessage } from '../../model/model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EmailService {
  constructor(private httpClient: HttpClient) {}

  send(
    emailMessage: IEmailMessage,
    callback?: (result: boolean) => void
  ): void {
    this.httpClient
      .post<boolean>('api/Email/Send', emailMessage)
      .subscribe(result => {
        if (callback) {
          callback(result);
        }
      });
  }
}
