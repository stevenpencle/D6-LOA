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

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get<IGraphData>('api/Sample/GetChartData', result => {
      this.data = result;
      this.data.seriesData[0].dataPoints = linq
        .from(this.data.seriesData[0].dataPoints)
        .orderBy(x => x.name)
        .toArray();
    });
  }

  updateData(event: any, dataPoint: IGraphDataPoint) {
    dataPoint.value = Number.parseInt(event.target.value);
    let dataPoints = linq
      .from(this.data.seriesData[0].dataPoints)
      .where(x => x.name !== dataPoint.name)
      .toArray();
    dataPoints = [...dataPoints, dataPoint];
    this.data.seriesData[0].dataPoints = linq
      .from(dataPoints)
      .orderBy(x => x.name)
      .toArray();
    console.log(dataPoint);
  }

  onSelect(event) {
    console.log(event);
  }
}
