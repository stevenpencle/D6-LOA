import { Injectable } from '@angular/core';

@Injectable()
export class DataMarshalerService {
  public payload = '';

  constructor() {}

  load(payload: string): void {
    this.payload = payload;
  }
}
