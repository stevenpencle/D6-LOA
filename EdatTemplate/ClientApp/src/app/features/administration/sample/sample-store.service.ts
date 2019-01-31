import { Injectable } from '@angular/core';
import {
  HttpService,
  ModelStateValidations
} from '../../../services/http/http.service';
import * as linq from 'linq';
import { ISample, IStringResponse } from '../../../model/model';
import { Store } from 'src/app/services/store/store.service';

@Injectable()
export class SampleStoreService extends Store<ISample[]> {
  constructor(private httpService: HttpService) {
    super('SampleStoreService', new Array<ISample>());
  }

  load(
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.get<ISample[]>(
      'api/Sample/GetSamples',
      result => {
        this.setState([...result]);
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

  add(
    sample: ISample,
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISample, ISample>(
      'api/Sample/AddOrUpdateSample',
      sample,
      result => {
        this.setState([...this.state, result]);
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
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISample, ISample>(
      'api/Sample/AddOrUpdateSample',
      sample,
      result => {
        this.setState([
          ...linq
            .from(this.state)
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

  remove(
    sample: ISample,
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISample, IStringResponse>(
      'api/Sample/RemoveSample',
      sample,
      result => {
        console.log(result.data);
        this.setState([
          ...linq
            .from(this.state)
            .where(x => x.id !== sample.id)
            .toArray()
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
}
