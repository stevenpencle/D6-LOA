import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as linq from 'linq';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IClientToken } from '../../model/model';
import { SecurityService } from './security.service';

@Injectable()
export class RouteGuard implements CanActivate, OnDestroy {
  token$: Observable<IClientToken>;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    securityService: SecurityService
  ) {
    securityService.safeSubscribe(this, () => {
      this.token$ = securityService.token$;
    });
  }

  ngOnDestroy(): void {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const tokenObservable =
      this.token$ !== undefined
        ? this.token$
        : this.httpClient.get<IClientToken>('api/security/gettoken');
    return tokenObservable.pipe(
      map(result => {
        if (result != null) {
          const routeData = route.data as RouteData;
          if (
            routeData == null ||
            routeData.AuthorizedRoles == null ||
            routeData.AuthorizedRoles.length === 0
          ) {
            return true;
          } else {
            if (result.roles == null || result.roles.length === 0) {
              this.router.navigateByUrl('/not-authorized');
            }
            for (let x = 0; x < routeData.AuthorizedRoles.length; x++) {
              for (let z = 0; z < result.roles.length; z++) {
                if (
                  routeData.AuthorizedRoles[x].trim().toLowerCase() ===
                  result.roles[z].trim().toLowerCase()
                ) {
                  return true;
                }
              }
            }
            this.router.navigateByUrl('/not-authorized');
          }
        } else {
          const pathSegments = linq
            .from(route.url)
            .select(x => x.path)
            .toArray();
          if (pathSegments.length > 0) {
            if (!pathSegments[0].startsWith('/')) {
              pathSegments[0] = '/' + pathSegments[0];
            }
            localStorage.setItem(
              'fast-route',
              JSON.stringify({
                path: pathSegments,
                queryParams: route.queryParams
              })
            );
          }
          window.location.replace('security/adlogin');
          return false;
        }
      })
    );
  }
}
