import { Injectable } from '@angular/core';
import * as linq from 'linq';
import { Store } from 'src/app/services/store/store.service';
import { ISampleMapFeature, IStringResponse } from 'src/app/model/model';
import {
  HttpService,
  ModelStateValidations
} from 'src/app/services/http/http.service';

@Injectable()
export class SampleMapStoreService extends Store<ISampleMapFeature[]> {
  constructor(private httpService: HttpService) {
    super('SampleMapStoreService', new Array<ISampleMapFeature>());
  }

  update(
    sampleMapFeature: ISampleMapFeature,
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISampleMapFeature, ISampleMapFeature>(
      'api/SampleMap/AddOrUpdate',
      sampleMapFeature,
      result => {
        this.setState([
          ...linq
            .from(this.getState())
            .where(x => x.id !== sampleMapFeature.id)
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
    sampleMapFeature: ISampleMapFeature,
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISampleMapFeature, IStringResponse>(
      'api/SampleMap/Remove',
      sampleMapFeature,
      result => {
        console.log(result.data);
        this.setState([
          ...linq
            .from(this.getState())
            .where(x => x.id !== sampleMapFeature.id)
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

  add(
    sampleMapFeature: ISampleMapFeature,
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISampleMapFeature, ISampleMapFeature>(
      'api/SampleMap/AddOrUpdate',
      sampleMapFeature,
      result => {
        this.setState([...this.getState(), result]);
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

  load(
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.get<ISampleMapFeature[]>(
      'api/SampleMap/Load',
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
}
