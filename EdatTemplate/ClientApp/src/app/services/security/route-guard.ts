import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as linq from 'linq';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IClientToken } from '../../model/model';

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(private router: Router, private httpClient: HttpClient) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.httpClient.get<IClientToken>('api/security/gettoken').pipe(
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
          window.location.replace('home/login');
          return false;
        }
      })
    );
  }
}
