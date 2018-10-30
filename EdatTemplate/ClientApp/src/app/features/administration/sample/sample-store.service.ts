import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISubscriberService } from '../../../services/subscriberService';
import { SubscriberHelper } from '../../../services/subscriberHelper';
import { HttpService } from '../../../services/http/http.service';
import * as linq from 'linq';
import { ISample, IStringResponse } from '../../../model/model';

@Injectable()
export class SampleStoreService
  implements ISubscriberService<ISample[]>, OnDestroy {
  private samples: BehaviorSubject<ISample[]>;
  private subscriberHelper = new SubscriberHelper();

  constructor(private httpService: HttpService) {
    this.samples = new BehaviorSubject<ISample[]>(new Array<ISample>());
  }

  subscribe(
    subscriber: OnDestroy,
    callback: (samples: ISample[]) => void
  ): void {
    if (this.subscriberHelper.hasSubscriber(subscriber)) {
      this.get();
    } else {
      this.get(() => {
        const subscription = this.samples.subscribe(samples => {
          console.log(
            'sample store - subscribed - total observers = ' +
              this.samples.observers.length
          );
          callback(samples);
        });
        this.subscriberHelper.addSubscriber(subscriber, subscription);
      });
    }
  }

  private get(callback?: () => void) {
    this.httpService.get<ISample[]>('api/Sample/GetSamples', result => {
      this.samples.next([...result]);
      if (callback) {
        callback();
      }
    });
  }

  unsubscribe(subscriber: OnDestroy, callback?: () => void): void {
    this.subscriberHelper.removeSubscriber(subscriber);
    console.log(
      'sample store - unsubscribed - total observers = ' +
        this.samples.observers.length
    );
    if (callback) {
      callback();
    }
  }

  ngOnDestroy(): void {
    this.subscriberHelper.removeAllSubscribers();
  }

  add(
    sample: ISample,
    callback?: () => void,
    errorCallback?: (errors: string) => void
  ): void {
    this.httpService.post<ISample, ISample>(
      'api/Sample/AddOrUpdateSample',
      sample,
      result => {
        this.samples.next([...this.samples.value, result]);
        if (callback) {
          callback();
        }
      },
      errors => {
        if (errorCallback) {
          errorCallback(errors);
        }
      }
    );
  }

  update(
    sample: ISample,
    callback?: () => void,
    errorCallback?: (errors: string) => void
  ): void {
    this.httpService.post<ISample, ISample>(
      'api/Sample/AddOrUpdateSample',
      sample,
      result => {
        this.samples.next([
          ...linq
            .from(this.samples.value)
            .where(x => x.id !== sample.id)
            .toArray(),
          result
        ]);
        if (callback) {
          callback();
        }
      },
      errors => {
        if (errorCallback) {
          errorCallback(errors);
        }
      }
    );
  }

  remove(sample: ISample, callback?: () => void): void {
    this.httpService.post<ISample, IStringResponse>(
      'api/Sample/RemoveSample',
      sample,
      result => {
        console.log(result.data);
        this.samples.next([
          ...linq
            .from(this.samples.value)
            .where(x => x.id !== sample.id)
            .toArray()
        ]);
        if (callback) {
          callback();
        }
      }
    );
  }
}
