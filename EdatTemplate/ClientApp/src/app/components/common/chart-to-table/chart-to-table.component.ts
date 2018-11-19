import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';
import { IGraphData } from 'src/app/model/model';
import { BaseChartComponent } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-chart-to-table',
  templateUrl: './chart-to-table.component.html'
})
export class ChartToTableComponent implements AfterContentInit {
  @Input() data: IGraphData;
  @ContentChildren('chart') charts: QueryList<BaseChartComponent>;
  showChart = true;

  constructor() {}

  toggleChart(): void {
    this.showChart = true;
    this.ngAfterContentInit();
  }

  toggleTable(): void {
    this.showChart = false;
  }

  ngAfterContentInit(): void {
    if (this.charts) {
      this.charts.map(c => c.update());
    }
  }
}
