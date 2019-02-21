import { Injectable } from '@angular/core';
import { IEdatHeader, IEdatFooter } from 'src/app/model/model';
import { HttpClient } from '@angular/common/http';
import { Store } from '../store/store.service';

@Injectable()
export class EnvironmentService extends Store<EnvironmentData> {
  public baseUrl = '';

  constructor(private httpClient: HttpClient) {
    super('EnvironmentService', { header: {}, footer: {} });
    const ele = document.getElementsByTagName('base');
    if (ele && ele[0] && ele[0].href) {
      this.baseUrl = ele[0].href;
    }
    this.httpClient.get<IEdatHeader>('api/site/GetHeader').subscribe(result => {
      this.setState({ header: result, footer: this.state.footer });
    });
    this.httpClient.get<IEdatFooter>('api/site/GetFooter').subscribe(result => {
      this.setState({ header: this.state.header, footer: result });
    });
  }
}

export interface EnvironmentData {
  header: IEdatHeader;
  footer: IEdatFooter;
}
