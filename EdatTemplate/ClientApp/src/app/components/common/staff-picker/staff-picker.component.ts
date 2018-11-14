import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { IStaff } from '../../../model/model';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError
} from 'rxjs/operators';
import { StaffService } from '../../../services/data/staff.service';

@Component({
  selector: 'app-staff-picker',
  templateUrl: './staff-picker.component.html'
})
export class StaffPickerComponent implements OnInit {
  @Output()
  selected = new EventEmitter<IStaff>();
  @Input()
  id: string;
  @Input()
  title: string;
  @Input()
  selectedStaff: IStaff;
  @ViewChild('input') input: ElementRef;
  searching = false;
  searchFailed = false;
  searchStaff: (text$: Observable<string>) => Observable<IStaff | any>;
  searchStaffResultFormatter: (value: IStaff, nameOnly?: boolean) => string;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.searchStaff = (
      text$: Observable<string>
    ): Observable<IStaff | any> => {
      return text$.pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => (this.searching = true)),
        switchMap(term => {
          if (term == null || term.length == null || term.length < 4) {
            return of([]);
          }
          return this.staffService.search(term).pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          );
        }),
        tap(() => (this.searching = false))
      );
    };
    this.searchStaffResultFormatter = (value: IStaff, nameOnly?: boolean) => {
      if (value == null) {
        return '';
      }
      let name = '';
      let userId = '';
      if (value.firstName != null && value.lastName != null) {
        name = value.firstName + ' ' + value.lastName;
      }
      if (value.district != null && value.racfId != null) {
        userId =
          ' (' +
          value.district.trim().toUpperCase() +
          '\\' +
          value.racfId.trim().toUpperCase() +
          ')';
      }
      return nameOnly ? name : name + userId;
    };
  }

  onModelChange(staff: IStaff): void {
    this.selectedStaff = staff;
    this.selected.emit(staff);
  }

  clearInput(): void {
    this.input.nativeElement.value = '';
  }
}
