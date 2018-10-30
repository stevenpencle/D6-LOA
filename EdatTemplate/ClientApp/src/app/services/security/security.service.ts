import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ISubscriberService } from '../subscriberService';
import { BehaviorSubject } from 'rxjs';
import { SubscriberHelper } from '../subscriberHelper';
import { IClientToken } from '../../model/model';

@Injectable()
export class SecurityService implements ISubscriberService<IClientToken> {
  private subscriberHelper = new SubscriberHelper();
  private token: BehaviorSubject<IClientToken>;

  constructor(private httpClient: HttpClient) {
    this.token = new BehaviorSubject<IClientToken>(null);
  }

  subscribe(
    subscriber: OnDestroy,
    callback: (token: IClientToken) => void
  ): void {
    if (this.subscriberHelper.hasSubscriber(subscriber)) {
      this.get();
    } else {
      this.get(() => {
        const subscription = this.token.subscribe(token => {
          console.log(
            'security service - subscribed - total observers = ' +
              this.token.observers.length
          );
          callback(token);
        });
        this.subscriberHelper.addSubscriber(subscriber, subscription);
      });
    }
  }

  private get(callback?: () => void): void {
    this.httpClient.get<IClientToken>('api/security/gettoken').subscribe(
      result => {
        this.token.next(result);
        if (callback) {
          callback();
        }
      },
      (httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === 401) {
          this.token.next(null);
          if (callback) {
            callback();
          }
        }
      }
    );
  }

  unsubscribe(subscriber: OnDestroy, callback?: () => void): void {
    this.subscriberHelper.removeSubscriber(subscriber);
    console.log(
      'security service - unsubscribed - total observers = ' +
        this.token.observers.length
    );
    if (callback) {
      callback();
    }
  }

  removeToken(): void {
    this.token.next(null);
  }
}
