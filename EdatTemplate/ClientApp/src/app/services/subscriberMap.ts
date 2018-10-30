import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export interface ISubscriberMap {
  subscriber: OnDestroy;
  subscription: Subscription;
}
