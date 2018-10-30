import { Injectable } from '@angular/core';

@Injectable()
export class EnvironmentService {
  public baseUrl = '';

  constructor() {
    const ele = document.getElementsByTagName('base');
    if (ele && ele[0] && ele[0].href) {
      this.baseUrl = ele[0].href;
    }
  }
}
