import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { MapFieldComponent } from 'src/app/components/common/map-field/map-field.component';

@Component({
  selector: 'app-sample-map',
  templateUrl: './sample-map.component.html'
})
export class SampleMapComponent {
  @ViewChild(MapFieldComponent, { static: true })
  private mapField: MapFieldComponent;
  mapId = '';

  load(): void {
    this.mapField.load(this.mapId);
  }
}
