import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { INameValuePair } from 'src/app/model/model';
import * as linq from 'linq';

@Component({
  selector: 'app-sample-charts',
  templateUrl: './sample-charts.component.html'
})
export class SampleChartsComponent implements OnInit {
  data: INameValuePair[] = [];
  options = {
    xAxisLabel: 'Country',
    yAxisLabel: 'Population',
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    }
  };

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get<INameValuePair[]>(
      'api/Sample/GetChartData',
      result => {
        this.data = linq
          .from(result)
          .orderBy(x => x.name)
          .toArray();
      }
    );
  }

  updateData(event: any, dataPoint: INameValuePair) {
    dataPoint.value = Number.parseInt(event.target.value);
    let dataPoints = linq
      .from(this.data)
      .where(x => x.name !== dataPoint.name)
      .toArray();
    dataPoints = [...dataPoints, dataPoint];
    this.data = linq
      .from(dataPoints)
      .orderBy(x => x.name)
      .toArray();
    console.log(dataPoint);
  }

  onSelect(event) {
    console.log(event);
  }
}
