import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { SecurityService } from '../../services/security/security.service';
import { HttpService } from '../../services/http/http.service';
import * as linq from 'linq';
import { IAuthProviderConfig } from '../../model/model';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent implements OnInit, OnDestroy {
  @ViewChild('skipnav', { static: true })
  skipnav: ElementRef;
  isAuthenticated = false;
  isAdmin = false;
  isB2CUser = false;
  userName = '';
  userId = '';
  role = 'user';
  canImpersonate = false;
  allowB2C = false;
  isB2CAuthenticated = false;
  collapsed = true;

  constructor(
    private securityService: SecurityService,
    private httpService: HttpService
  ) {}

  ngOnInit(): void {
    this.httpService.get<IAuthProviderConfig>(
      'api/security/getAuthProviderConfig',
      result => {
        this.allowB2C = result.allowB2C;
        this.canImpersonate = result.allowImpersonation;
      }
    );
    this.securityService.safeSubscribe(
      this,
      token => {
        if (token == null) {
          this.isAuthenticated = false;
          this.isAdmin = false;
          this.isB2CUser = false;
          this.userId = '';
          this.userName = '';
          this.role = 'NotAuthorized';
          this.isB2CAuthenticated = false;
        } else {
          this.isAuthenticated = true;
          this.isAdmin =
            token.roles !== undefined &&
            token.roles !== null &&
            Array.isArray(token.roles) &&
            linq.from(token.roles).any(x => x === 'Admin');
          this.isB2CUser =
            token.roles !== undefined &&
            token.roles !== null &&
            Array.isArray(token.roles) &&
            linq.from(token.roles).any(x => x === 'B2CUser');
          if (this.isAdmin) {
            this.role = 'Admin';
          } else if (this.isB2CUser) {
            this.role = 'B2CUser';
          } else {
            this.role = 'NotAuthorized';
          }
          this.userId = token.userId;
          this.userName = token.fullName;
          this.isB2CAuthenticated = token.authMode === 'B2C';
        }
      },
      () => {
        this.securityService.getToken();
      }
    );
  }

  ngOnDestroy(): void {}

  skipNavigation(): void {
    this.skipnav.nativeElement.focus();
  }

  notAuthorized(): void {
    this.httpService.get('api/security/notAuthorized', () => {});
  }

  changeRole(role: string): void {
    location.replace('/security/impersonate/' + role);
  }
}
