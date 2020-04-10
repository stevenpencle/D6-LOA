import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    TemplateRef,
    ViewChild,
  } from '@angular/core';
  import { ISupplement } from 'src/app/model/model';

  @Component({
    selector: 'app-supplemental',
    templateUrl: './supplemental.component.html',
  })
  export class SupplementalComponent implements OnInit, OnDestroy {
    supplement: ISupplement = {};
    constructor() {}

    ngOnInit(): void {}
    ngOnDestroy(): void {}
  }
