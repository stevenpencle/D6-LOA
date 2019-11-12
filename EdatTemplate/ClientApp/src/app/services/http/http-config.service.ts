import { Injectable } from '@angular/core';

@Injectable()
export class HttpConfigService {

  postOptions = {
    headers: {
      'ng-api-call': 'true',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2019 00:00:00 GMT'
    }
  };

  getOptions = {
    headers: {
      'ng-api-call': 'true'
    }
  };

  constructor() { }

}
