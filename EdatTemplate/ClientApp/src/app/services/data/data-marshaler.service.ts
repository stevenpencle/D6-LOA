import { Injectable } from '@angular/core';

@Injectable()
export class DataMarshalerService {
  public payload = '';

  constructor() {}

  load(payload: string): void {
    this.payload = payload;
  }

  clone<T>(source: T): T {
    return JSON.parse(JSON.stringify(source));
  }
}
