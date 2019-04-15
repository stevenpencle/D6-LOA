import { Component } from '@angular/core';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html'
})
export class SampleComponent {
  observableFilter: string;
  initSampleDataComponent = true;

  constructor() {}

  observableFilterChange(val: string): void {
    this.observableFilter = val;
    this.initSampleDataComponent = false;
  }

  applyFilter(): void {
    this.initSampleDataComponent = true;
  }
}
