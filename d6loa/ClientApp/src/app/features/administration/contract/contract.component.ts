import { Component, OnInit, OnDestroy } from '@angular/core';
import { IContract } from 'src/app/model/model';

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html'
  })
  export class ContractComponent implements OnInit, OnDestroy {
    contract: IContract = {};


    constructor() {}


    ngOnInit(): void { }

     ngOnDestroy(): void { }

}
