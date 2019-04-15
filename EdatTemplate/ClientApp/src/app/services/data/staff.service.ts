import { Injectable } from '@angular/core';
import { IStaff } from '../../model/model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class StaffService {
  constructor(private httpClient: HttpClient) {}

  search(namePattern: string): Observable<IStaff[]> {
    return this.httpClient
      .post<IStaff[]>('api/Staff/Search', { data: namePattern })
      .pipe(map(result => result));
  }

  get(id: number, callback: (staff: IStaff) => void): void {
    this.httpClient.get<IStaff>('api/Staff/Get/' + id).subscribe(result => {
      callback(result);
    });
  }
}
