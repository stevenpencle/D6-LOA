import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { IGraphData, IGraphDataPoint } from 'src/app/model/model';
import * as linq from 'linq';

@Component({
  selector: 'app-sample-charts',
  templateUrl: './sample-charts.component.html'
})
export class SampleChartsComponent implements OnInit {
  data: IGraphData;
  options = {
    xAxisLabel: 'Country',
    yAxisLabel: 'Population',
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    }
  };
  lineData: IGraphData;
  lineOptions = {
    xAxisLabel: 'Census Date',
    yAxisLabel: 'GDP Per Capita',
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    }
  };
  showPopulationCharts = true;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get<IGraphData>(
      'api/Sample/GetPopulationChartData',
      result => {
        this.data = result;
        this.data.seriesData[0].series = linq
          .from(this.data.seriesData[0].series)
          .orderBy(x => x.name)
          .toArray();
      }
    );
    this.httpService.get<IGraphData>('api/Sample/GetGdpChartData', result => {
      this.lineData = result;
    });
  }

  updateData(event: any, dataPoint: IGraphDataPoint): void {
    dataPoint.value = Number.parseInt(event.target.value, 10);
    let dataPoints = linq
      .from(this.data.seriesData[0].series)
      .where(x => x.name !== dataPoint.name)
      .toArray();
    dataPoints = [...dataPoints, dataPoint];
    this.data.seriesData[0].series = linq
      .from(dataPoints)
      .orderBy(x => x.name)
      .toArray();
    console.log(dataPoint);
  }

  togglePieChart(tableDataDisplayed: boolean): void {
    this.showPopulationCharts = !tableDataDisplayed;
  }

  onSelect(event: any): void {
    console.log(event);
  }
}
