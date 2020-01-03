import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { MapFieldComponent } from 'src/app/components/common/map-field/map-field.component';

@Component({
  selector: 'app-sample-map',
  templateUrl: './sample-map.component.html'
})
export class SampleMapComponent implements AfterContentInit {
  @ViewChild(MapFieldComponent, { static: true })
  private mapField: MapFieldComponent;
  // mapId = 'MAPS/2287529e-0fbd-438d-8ba1-7c7164732b96';
  mapId = '';

  ngAfterContentInit(): void {
    this.mapField.load();
  }

  load(): void {
    this.mapField.load();
  }
}
