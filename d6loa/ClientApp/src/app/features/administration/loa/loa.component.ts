import {
    Component,
    OnInit,
    OnDestroy} from '@angular/core';
import { ILoa } from 'src/app/model/model';

    @Component({
        selector: 'app-loa',
        templateUrl: './loa.component.html',
      })

      export class LoaComponent implements OnInit, OnDestroy {

        loa: ILoa = {};

        constructor() {}

        ngOnInit(): void { }

        ngOnDestroy(): void { }

    }
