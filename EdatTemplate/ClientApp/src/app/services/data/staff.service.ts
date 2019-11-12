import { Injectable } from '@angular/core';
import { IStaff, IFdotAppUser } from '../../model/model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoadingService } from '../environment/loading.service';

@Injectable()
export class StaffService {
  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  search(namePattern: string): Observable<IStaff[]> {
    return this.httpClient
      .post<IStaff[]>(
        'api/Staff/Search',
        {
          data: namePattern
        },
        {
          headers: {
            'ng-api-call': 'true'
          }
        }
      )
      .pipe(map(result => result));
  }

  get(id: number, callback: (staff: IStaff) => void): void {
    const completed = this.loadingService.show();
    this.httpClient
      .get<IStaff>('api/Staff/Get/' + id, {
        headers: {
          'ng-api-call': 'true',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: 'Sat, 01 Jan 2019 00:00:00 GMT'
        }
      })
      .subscribe(
        result => {
          callback(result);
          completed();
        },
        () => {
          completed();
        }
      );
  }

  saveFdotAppUser(
    staff: IStaff,
    callback: (fdotAppUser: IFdotAppUser) => void
  ): void {
    const completed = this.loadingService.show();
    this.httpClient
      .post<IFdotAppUser>('api/Staff/SaveFdotAppUser/', staff, {
        headers: {
          'ng-api-call': 'true'
        }
      })
      .subscribe(
        result => {
          callback(result);
          completed();
        },
        () => {
          completed();
        }
      );
  }
}
