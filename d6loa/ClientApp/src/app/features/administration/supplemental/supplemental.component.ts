import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    TemplateRef,
    ViewChild,
  } from '@angular/core';
  import * as moment from 'moment';
  import { ISupplement } from 'src/app/model/model';
import { HttpService } from 'src/app/services/http/http.service';

  @Component({
    selector: 'app-supplemental',
    templateUrl: './supplemental.component.html',
  })
  export class SupplementalComponent implements OnInit, OnDestroy {
    supplement: ISupplement = {};
    startDate: moment.Moment;
    endDate: moment.Moment;


    constructor(private httpService: HttpService) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {}

    saveSupplemental(): void {

      const today = new Date();

      if (
        this.startDate !== undefined &&
        this.startDate !== null &&
        this.startDate.isValid()
      ) {
        this.supplement.startDate = this.startDate.toDate();
      } else {
        this.supplement.startDate = today;
      }


      this.httpService.post<ISupplement, ISupplement>
      ('api/supplemental/save',
        this.supplement,
        result => {
          this.supplement = result;
          this.startDate = moment(this.supplement.startDate);
                  }
      );
    }
  }
