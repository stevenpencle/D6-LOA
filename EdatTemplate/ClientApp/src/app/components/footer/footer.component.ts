import { Component, OnInit, OnDestroy } from '@angular/core';
import { SecurityService } from '../../services/security/security.service';
import { IEdatFooter } from '../../model/model';
import * as moment from 'moment';
import { EnvironmentService } from 'src/app/services/environment/environment.service';

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
    private securityService: SecurityService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    this.currentYear = moment()
      .year()
      .toString();
    this.securityService.safeSubscribe(
      this,
      token => {
        if (token == null) {
          this.isAuthenticated = false;
        } else {
          this.isAuthenticated = true;
        }
      },
      () => {
        this.securityService.getToken();
      }
    );
    this.environmentService.safeSubscribe(this, state => {
      this.footer = state.footer;
    });
  }

  ngOnDestroy(): void {}
}
