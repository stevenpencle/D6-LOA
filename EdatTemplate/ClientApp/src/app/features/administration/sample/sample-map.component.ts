import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterContentInit
} from '@angular/core';
import {
  Map,
  TileLayer,
  FeatureGroup,
  geoJSON,
  control,
  Control,
  ControlOptions,
  DrawOptions,
  PathOptions,
  Draw
} from 'leaflet';
// import * as L from 'leaflet';
// import { featureGroup } from 'leaflet';
import 'leaflet-draw';
import 'leaflet-styleeditor';
import { stringify, parse } from 'wellknown';
import { ISampleMapFeature } from 'src/app/model/model';
import { SampleMapStoreService } from './sample-map-store.service';

@Component({
  selector: 'app-sample-map',
  templateUrl: './sample-map.component.html',
  styleUrls: ['./sample-map.component.scss']
})
export class SampleMapComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() projectLocationInfo: any;
  @ViewChild('mapArea', { static: true })
  private mapArea: ElementRef<HTMLDivElement>;
  map: Map;
  json: any;
  GeoJson: any;
  wktMap: string[];
  Options = [];
  sampleMapFeature: ISampleMapFeature = {};

  constructor(private sampleMapStoreService: SampleMapStoreService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngAfterContentInit() {
    // base map configuration
    this.map = new Map(this.mapArea.nativeElement, {
      center: [30.439794, -84.290886],
      zoom: 12
    });
    const baseMapUrl =
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
    const baseMapLayer = new TileLayer(baseMapUrl, {
      maxZoom: 18
    });
    this.map.addLayer(baseMapLayer);
    //
    const editableLayers = new FeatureGroup();
    this.sampleMapStoreService.safeSubscribe(
      this,
      sampleMapFeatures => {
        if (sampleMapFeatures.length > 0) {
          this.sampleMapFeature.id = sampleMapFeatures[0].id;
          this.projectLocationInfo = sampleMapFeatures[0].mapCoordinates;
        }
        if (
          this.projectLocationInfo !== undefined &&
          this.projectLocationInfo !== null
        ) {
          const items = this.projectLocationInfo.split('~');
          let drawItem: any = null;
          for (let i = 0; i < items.length; i++) {
            const itemOptions = items[i].split(',Options:')[1];
            drawItem = items[i].split(',Options:')[0];
            geoJSON(parse(drawItem) as any, {
              onEachFeature: (_feature, layer) => {
                const setStyleFunc = (layer as any).setStyle;
                if (setStyleFunc !== undefined) {
                  setStyleFunc(JSON.parse(itemOptions));
                  this.Options[i] = JSON.parse(itemOptions);
                }
                if (layer.bindPopup !== undefined) {
                  layer
                    .bindPopup(JSON.parse(itemOptions).popupContent)
                    .openPopup();
                }
                editableLayers.addLayer(layer);
              }
            }).addTo(this.map);
          }
          if (drawItem !== null) {
            const coordinates = (parse(drawItem) as any).coordinates;
            if (coordinates.length === 2) {
              this.map.flyTo([coordinates[1], coordinates[0]], 12);
            } else if (coordinates.length > 2) {
              this.map.flyTo([coordinates[0][1], coordinates[0][0]], 12);
            }
          }
        }
      },
      () => {
        this.sampleMapStoreService.load();
      }
    );

    // const styleEditor = (control as any).styleEditor({
    //   position: 'topleft',
    //   useGrouping: false,
    //   colorRamp: ['#1abc9c', '#2ecc71', '#3498db'],
    //   openOnLeafletDraw: false
    // });
    // this.map.addControl(styleEditor);
    this.map.addLayer(editableLayers);

    const polyline: DrawOptions.PolylineOptions = {
      metric: false,
      feet: false,
      shapeOptions: {
        color: 'black'
      },
      repeatMode: true
    };

    const polygon: DrawOptions.PolygonOptions = {
      allowIntersection: false
    };

    const rectangle: DrawOptions.RectangleOptions = {
      shapeOptions: {
        stroke: true,
        weight: 4,
        opacity: 0.5,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2
      }
    };

    const controlDrawOptions: Control.DrawOptions = {
      polyline: polyline,
      polygon: polygon,
      circle: false,
      circlemarker: false,
      rectangle: rectangle,
      marker: false
    };

    const controlEditOptions: Control.EditOptions = {
      featureGroup: editableLayers
    };

    const opts: Control.DrawConstructorOptions = {
      position: 'topright',
      draw: controlDrawOptions,
      edit: controlEditOptions
    };

    const drawControl = new Control.Draw(opts);
    this.map.addControl(drawControl);

    this.map.on(Draw.Event.CREATED, e => {
      // const type = e.type;
      const layer = e.propagatedFrom;
      console.log(layer);
      editableLayers.addLayer(layer);
      this.GeoJson = editableLayers.toGeoJSON();
      layer.options.id = layer._leaflet_id;
      this.Options.push(layer.options);
      console.log(this.wktMap, this.Options);
      this.updateMap();
    });

    this.map.on(Draw.Event.EDITED, e => {
      // const layers = e.layers;
      // layers.eachLayer(layer => {
      //   console.log(layer);
      //   if (layer instanceof L.Rectangle) {
      //     console.log('im an instance of L rectangle');
      //   }
      //   if (layer instanceof L.Polygon) {
      //     console.log('im an instance of L polygon');
      //   }
      //   if (layer instanceof L.Polyline) {
      //     console.log('im an instance of L polyline');
      //   }
      //   editableLayers.addLayer(layer);
      //   layer.options.id = layer._leaflet_id;
      //   this.Options.forEach((x, i) => {
      //     if (x.id === layer._leaflet_id) {
      //       this.Options[i] = layer.options;
      //     }
      //   });
      //   this.GeoJson = editableLayers.toGeoJSON();
      //   this.updateMap();
      // });
    });

    this.map.on(Draw.Event.DELETED, e => {
      // const layers = e.layers;
      // layers.eachLayer(layer => {
      //   this.Options.forEach((x, i) => {
      //     if (x.id === layer._leaflet_id) {
      //       this.Options.splice(i, 1);
      //     }
      //   });
      //   console.log('remove');
      // });
      // this.GeoJson = editableLayers.toGeoJSON();
      // this.updateMap();
    });

    this.map.on('styleeditor:changed', element => {
      // this.Options.forEach((x, i) => {
      //   if (x.id === element.options.id) {
      //     this.Options[i] = element.options;
      //   }
      // });
      // this.GeoJson = editableLayers.toGeoJSON();
      // this.updateMap();
    });
  }

  updateMap(): void {
    const wkt = new Array();
    for (let i = 0; i < this.GeoJson.features.length; i++) {
      console.log(stringify(this.GeoJson.features[i].geometry));
      console.log(this.Options[i]);
      wkt.push(
        stringify(this.GeoJson.features[i].geometry) +
          ',Options:' +
          JSON.stringify(this.Options[i])
      );
    }
    this.json = wkt;
  }

  saveMap(): void {
    if (this.json !== undefined) {
      this.sampleMapFeature.mapCoordinates = this.json[0];
      for (let i = 1; i < this.json.length; i++) {
        this.sampleMapFeature.mapCoordinates += '~' + this.json[i];
      }
    }
    // this.addNewApplication();
  }
}
