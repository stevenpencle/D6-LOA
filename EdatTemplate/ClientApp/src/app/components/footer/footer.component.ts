import { Component } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { SecurityService } from '../../services/security/security.service';
import { HttpService } from '../../services/http/http.service';
import { IEdatFooter } from '../../model/model';
import * as moment from 'moment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  footer: IEdatFooter = {};
  currentYear = '';

  constructor(
    private httpService: HttpService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.currentYear = moment()
      .year()
      .toString();
    this.securityService.safeSubscribe(this, token => {
      if (token == null) {
        this.isAuthenticated = false;
      } else {
        this.isAuthenticated = true;
      }
    });
    this.securityService.getToken();
    this.httpService.get<IEdatFooter>('api/site/GetFooter', result => {
      this.footer = result;
    });
  }

  ngOnDestroy(): void {}
}
