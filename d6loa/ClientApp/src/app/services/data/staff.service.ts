import { Injectable } from '@angular/core';
import { IStaff, IFdotAppUser } from '../../model/model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoadingService } from '../environment/loading.service';
import { HttpConfigService } from '../http/http-config.service';

@Injectable()
export class StaffService {
  constructor(
    private httpClient: HttpClient,
    private httpConfigService: HttpConfigService,
    private loadingService: LoadingService
  ) {}

  search(namePattern: string): Observable<IStaff[]> {
    return this.httpClient
      .post<IStaff[]>(
        'api/Staff/Search',
        { data: namePattern },
        this.httpConfigService.postOptions()
      )
      .pipe(map(result => result));
  }

  get(id: number, callback: (staff: IStaff) => void): void {
    const completed = this.loadingService.show();
    this.httpClient
      .get<IStaff>('api/Staff/Get/' + id, this.httpConfigService.getOptions())
      .subscribe(
        result => {
          completed();
          callback(result);
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
      .post<IFdotAppUser>(
        'api/Staff/SaveFdotAppUser/',
        staff,
        this.httpConfigService.postOptions()
      )
      .subscribe(
        result => {
          completed();
          callback(result);
        },
        () => {
          completed();
        }
      );
  }
}
