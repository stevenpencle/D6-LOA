import { OnDestroy } from '@angular/core';
import { ISubscriberMap } from './subscriberMap';
import { Subscription } from 'rxjs';
import * as linq from 'linq';

export class SubscriberHelper {
  private subscribers: ISubscriberMap[] = [];

  constructor() {}

  hasSubscriber(subscriber: OnDestroy): boolean {
    const subscriberMap = linq
      .from(this.subscribers)
      .where(x => x.subscriber === subscriber)
      .firstOrDefault();
    return subscriberMap != null;
  }

  addSubscriber(subscriber: OnDestroy, subscription: Subscription): void {
    const subscriberMap = linq
      .from(this.subscribers)
      .where(x => x.subscriber === subscriber)
      .toArray();
    if (subscriberMap != null && subscriberMap.length > 0) {
      for (let x = 0; x < subscriberMap.length; x++) {
        subscriberMap[x].subscription.unsubscribe();
      }
      this.subscribers = linq
        .from(this.subscribers)
        .where(x => x.subscriber !== subscriber)
        .toArray();
      throw new Error(
        'subscriber is already registered - potential memory leak!'
      );
    }
    this.subscribers.push({
      subscriber: subscriber,
      subscription: subscription
    });
  }

  removeSubscriber(subscriber: OnDestroy): void {
    const subscriberMap = linq
      .from(this.subscribers)
      .where(x => x.subscriber === subscriber)
      .firstOrDefault();
    if (subscriberMap == null) {
      return;
    }
    subscriberMap.subscription.unsubscribe();
    this.subscribers = linq
      .from(this.subscribers)
      .where(x => x.subscriber !== subscriber)
      .toArray();
  }

  removeAllSubscribers(): void {
    for (let x = 0; x < this.subscribers.length; x++) {
      this.subscribers[x].subscription.unsubscribe();
    }
    this.subscribers = [];
  }
}
