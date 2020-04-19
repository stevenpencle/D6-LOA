import { Component, OnInit, OnDestroy } from '@angular/core';
import { IContract } from 'src/app/model/model';
import { HttpService } from 'src/app/services/http/http.service';
import * as moment from 'moment';

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html'
  })
  export class ContractComponent implements OnInit, OnDestroy {
    contract: IContract = {};
    startDate: moment.Moment;
    endDate: moment.Moment;
    extDate: moment.Moment;


    constructor(private httpService: HttpService) {}


    ngOnInit(): void { }

     ngOnDestroy(): void { }

     saveContract(): void {

      const today = new Date();

      if (
        this.startDate !== undefined &&
        this.startDate !== null &&
        this.startDate.isValid()
      ) {
        this.contract.startDate = this.startDate.toDate();
      } else {
        this.contract.startDate = today;
      }

      if (
        this.endDate !== undefined &&
        this.endDate !== null &&
        this.endDate.isValid()
      ) {
        this.contract.endDate = this.endDate.toDate();
      } else {
        this.contract.endDate = today;
      }


      this.httpService.post<IContract, IContract>
      ('api/contract/save',
        this.contract,
        result => {
          this.contract = result;
          this.startDate = moment(this.contract.startDate);
          this.endDate = moment(this.contract.endDate);
                  }
      );
    }


}
