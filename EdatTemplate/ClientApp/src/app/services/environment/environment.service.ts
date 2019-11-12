import { Injectable } from '@angular/core';
import { IEdatHeader, IEdatFooter } from 'src/app/model/model';
import { HttpClient } from '@angular/common/http';
import { Store } from '../store/store.service';
import { LoadingService } from './loading.service';

@Injectable()
export class EnvironmentService extends Store<EnvironmentData> {
  public baseUrl = '';

  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {
    super('EnvironmentService', { header: {}, footer: {} });
    const ele = document.getElementsByTagName('base');
    if (ele && ele[0] && ele[0].href) {
      this.baseUrl = ele[0].href;
    }
    const completedHeader = this.loadingService.show();
    this.httpClient.get<IEdatHeader>('api/site/GetHeader').subscribe(
      result => {
        this.setState({ header: result, footer: this.getState().footer });
        completedHeader();
      },
      () => {
        completedHeader();
      }
    );
    const completedFooter = this.loadingService.show();
    this.httpClient.get<IEdatFooter>('api/site/GetFooter').subscribe(
      result => {
        this.setState({ header: this.getState().header, footer: result });
        completedFooter();
      },
      () => {
        completedFooter();
      }
    );
  }
}

export interface EnvironmentData {
  header: IEdatHeader;
  footer: IEdatFooter;
}
