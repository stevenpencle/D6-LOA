import { Injectable } from '@angular/core';
import * as linq from 'linq';
import { Store } from 'src/app/services/store/store.service';
import { ISampleMap, IStringResponse } from 'src/app/model/model';
import {
  HttpService,
  ModelStateValidations
} from 'src/app/services/http/http.service';

@Injectable()
export class SampleMapStoreService extends Store<ISampleMap[]> {
  constructor(private httpService: HttpService) {
    super('SampleMapStoreService', new Array<ISampleMap>());
  }

  update(
    sample: ISampleMap,
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISampleMap, ISampleMap>(
      'api/Sample/AddOrUpdateSample',
      sample,
      result => {
        this.setState([
          ...linq
            .from(this.getState())
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
    sample: ISampleMap,
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISampleMap, IStringResponse>(
      'api/Sample/RemoveSample',
      sample,
      result => {
        console.log(result.data);
        this.setState([
          ...linq
            .from(this.getState())
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

  add(
    sampleMap: ISampleMap,
    callback?: () => void,
    errorCallback?: (errors: ModelStateValidations) => void
  ): void {
    this.httpService.post<ISampleMap, ISampleMap>(
      'api/Sample/AddOrUpdateSampleMap',
      sampleMap,
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
    this.httpService.get<ISampleMap[]>(
      'api/Sample/GetSampleMapCoordinate',
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
