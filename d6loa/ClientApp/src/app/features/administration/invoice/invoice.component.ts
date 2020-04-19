import { Component, OnInit, OnDestroy } from '@angular/core';
import {IInvoice } from 'src/app/model/model';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html'
  })
  export class InvoiceComponent implements OnInit, OnDestroy {
    invoice: IInvoice = {};


    constructor() {}


    ngOnInit(): void { }

     ngOnDestroy(): void { }

}
