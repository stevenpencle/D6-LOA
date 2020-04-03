import { Component, OnDestroy, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security/security.service';
import * as linq from 'linq';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html'
})
export class SampleComponent implements OnInit, OnDestroy {
  observableFilter: string;
  initSampleDataComponent = true;
  isAdmin = false;

  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.securityService.safeSubscribe(
      this,
      token => {
        if (token == null) {
          this.isAdmin = false;
        } else {
          this.isAdmin =
            token.roles !== undefined &&
            token.roles !== null &&
            Array.isArray(token.roles) &&
            linq.from(token.roles).any(x => x === 'Admin');
        }
      },
      () => {
        this.securityService.getToken();
      }
    );
  }

  ngOnDestroy(): void {}

  observableFilterChange(val: string): void {
    this.observableFilter = val;
    this.initSampleDataComponent = false;
  }

  applyFilter(): void {
    this.initSampleDataComponent = true;
  }
}
