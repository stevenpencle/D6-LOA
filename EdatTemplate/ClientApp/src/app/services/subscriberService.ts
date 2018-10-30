import { OnDestroy } from '@angular/core';

export interface ISubscriberService<TObservable> {
  subscribe(
    subscriber: OnDestroy,
    data: any,
    callback: (observableResults: TObservable) => void
  ): void;
  unsubscribe(subscriber: OnDestroy, callback?: () => void): void;
}
