import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html'
})
export class DateFieldComponent {
  @Input()
  title: string;
  @Input()
  id: string;
  @Output() momentChange: EventEmitter<moment.Moment> = new EventEmitter<
    moment.Moment
  >();
  @Input()
  set moment(value: moment.Moment) {
    if (value == null || !moment.isMoment(value) || !value.isValid()) {
      this.stringDate = '';
    } else {
      this.stringDate = value.startOf('day').format('MM-DD-YYYY');
    }
  }

  //internal
  stringDate = '';

  constructor() {}

  onBlur(): void {
    const m = moment(this.stringDate, 'MM-DD-YYYY');
    if (m == null || !moment.isMoment(m) || !m.isValid()) {
      this.stringDate = '';
      this.momentChange.emit(null);
      return;
    }
    this.momentChange.emit(m.startOf('day'));
  }
}
