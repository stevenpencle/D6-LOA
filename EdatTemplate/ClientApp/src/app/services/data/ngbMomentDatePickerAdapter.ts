import { Injectable } from '@angular/core';
import {
  NgbDateAdapter,
  NgbDateStruct
} from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Injectable()
export class NgbMomentDatePickerAdapter extends NgbDateAdapter<moment.Moment> {
  fromModel(date: moment.Moment): NgbDateStruct {
    if (date == null || !moment.isMoment(date) || !date.isValid()) {
      return null;
    }
    return {
      year: date.year(),
      month: date.month() + 1,
      day: date.date()
    };
  }

  toModel(date: NgbDateStruct): moment.Moment {
    if (date == null) {
      return null;
    }
    const m = moment().startOf('day');
    m.year(date.year);
    m.month(date.month - 1);
    m.date(date.day);
    return m;
  }
}
