import { Injectable } from '@angular/core';

@Injectable()
export class HttpConfigService {
  postOptions(isBlobResponse: boolean = false) {
    return {
      responseType: isBlobResponse ? ('blob' as 'json') : 'json',
      headers: {
        'ng-api-call': 'true',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2020 00:00:00 GMT'
      }
    };
  }

  getOptions(isBlobResponse: boolean = false) {
    return {
      responseType: isBlobResponse ? ('blob' as 'json') : 'json',
      headers: {
        'ng-api-call': 'true',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2020 00:00:00 GMT'
      }
    };
  }

  constructor() {}
}
