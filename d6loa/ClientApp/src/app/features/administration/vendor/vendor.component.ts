import {
  Component,
  OnInit,
  OnDestroy} from '@angular/core';
import { IVendor } from 'src/app/model/model';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
})
export class VendorComponent implements OnInit, OnDestroy {
  vendor: IVendor = {};
  constructor() {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
