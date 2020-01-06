import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterContentInit,
  Output,
  EventEmitter
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-search';
import 'leaflet-styleeditor';
import { GeoSearchControl, EsriProvider } from 'leaflet-geosearch';
import { stringify, parse } from 'wellknown';
import { HttpService } from 'src/app/services/http/http.service';
import {
  IMapRequest,
  IStringResponse,
  IDocumentMetadata
} from 'src/app/model/model';

@Component({
  selector: 'app-map-field',
  templateUrl: './map-field.component.html',
  styleUrls: ['./map-field.component.scss']
})
export class MapFieldComponent implements AfterContentInit {
  @ViewChild('mapArea', { static: true })
  private mapArea: ElementRef<HTMLDivElement>;
  // vars
  map: L.Map;
  featureGroup: L.FeatureGroup = new L.FeatureGroup();
  json: Array<string>;
  geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry, any>;
  options = [];
  mapJson: string = null;
  // inputs
  @Input() mapBlobFolder: string;
  @Input() showSave = true;
  @Input() readOnly = false;
  // model
  private blobId = '';
  @Output() mapBlobIdChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() set mapBlobId(value: string) {
    this.blobId = value;
  }

  constructor(private httpService: HttpService) {}

  ngAfterContentInit() {
    this.initializeBaseMap();
    this.configureMap();
    this.load();
  }

  load(): void {
    if (this.blobId !== null && this.blobId !== '') {
      this.httpService.post<IMapRequest, IStringResponse>(
        'api/Map/Load',
        {
          currentMapId: this.blobId,
          mapBlobStorageFolder: this.mapBlobFolder,
          mapGeoJson: null
        },
        response => {
          if (response.data !== null) {
            this.mapJson = response.data;
            this.addLayersToMap();
          }
        }
      );
    }
  }

  save(): void {
    if (this.readOnly) {
      return;
    }
    if (this.json !== undefined && this.json !== null && this.json.length > 0) {
      this.mapJson = this.json[0];
      for (let i = 1; i < this.json.length; i++) {
        this.mapJson += '~' + this.json[i];
      }
    } else {
      this.mapJson = '';
    }
    this.httpService.post<IMapRequest, IDocumentMetadata>(
      'api/map/Save',
      {
        currentMapId: this.blobId,
        mapBlobStorageFolder: this.mapBlobFolder,
        mapGeoJson: this.mapJson
      },
      response => {
        this.blobId = response.id;
        this.mapBlobIdChange.emit(this.blobId);
      }
    );
  }

  private updateMap(): void {
    if (this.readOnly) {
      return;
    }
    const wkt = new Array<string>();
    for (let i = 0; i < this.geoJson.features.length; i++) {
      wkt.push(
        stringify(this.geoJson.features[i].geometry) +
          ', options: ' +
          JSON.stringify(this.options[i])
      );
    }
    this.json = wkt;
  }

  private initializeBaseMap(): void {
    this.map = new L.Map(this.mapArea.nativeElement, {
      center: [30.439794, -84.290886],
      zoom: 12
    });
    // TODO: add to appSettings
    const baseMapUrl =
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
    const baseMapLayer = new L.TileLayer(baseMapUrl, {
      maxZoom: 18
    });
    this.map.addLayer(baseMapLayer);
  }

  private configureMap(): void {
    // add feature search control
    const searchControl = new (L.Control as any).Search({
      layer: this.featureGroup,
      initial: false,
      propertyName: 'popupContent'
    });
    this.map.addControl(searchControl);
    // add address search control
    const provider = new EsriProvider();
    const geoSearchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar'
    });
    this.map.addControl(geoSearchControl);
    // add feature group to map
    this.map.addLayer(this.featureGroup);
    if (!this.readOnly) {
      // TODO: add style options to component
      // add style editor control
      const styleEditor = (L.control as any).styleEditor({
        position: 'topleft',
        useGrouping: false,
        colorRamp: ['#1abc9c', '#2ecc71', '#3498db'],
        openOnLeafletDraw: false
      });
      this.map.addControl(styleEditor);
      // add draw controls
      const drawControl = new L.Control.Draw(
        this.getDrawConstructorOptions(this.featureGroup)
      );
      this.map.addControl(drawControl);
      // add draw handlers
      this.map.on(L.Draw.Event.CREATED, e => {
        this.drawCreated(e);
      });
      this.map.on(L.Draw.Event.EDITED, e => {
        this.drawEdited(e);
      });
      this.map.on(L.Draw.Event.DELETED, e => {
        this.drawDeleted(e);
      });
      this.map.on('styleeditor:changed', element => {
        this.styleChanged(element);
      });
    }
  }

  private addLayersToMap(): void {
    const items = this.mapJson.split('~');
    let drawItem: string = null;
    for (let i = 0; i < items.length; i++) {
      const itemOptions = items[i].split(', options: ')[1];
      drawItem = items[i].split(', options: ')[0];
      const geoJsonLayer = L.geoJSON(parse(drawItem) as any, {
        onEachFeature: (_feature, layer) => {
          let itemOptionsObj: any = null;
          try {
            itemOptionsObj = JSON.parse(itemOptions);
            if ((layer as any).setStyle !== undefined) {
              (layer as any).setStyle(itemOptionsObj);
              this.options[i] = itemOptionsObj;
            }
            if (
              layer.bindPopup !== undefined &&
              itemOptionsObj.popupContent !== undefined
            ) {
              layer.bindPopup(JSON.parse(itemOptions).popupContent).openPopup();
            }
          } catch (e) {
            console.log('itemOptions: ' + itemOptions);
            console.log('JSON Parse Error:');
            console.log(e);
          }
          this.featureGroup.addLayer(layer);
        }
      });
      this.map.addLayer(geoJsonLayer);
    }
  }

  private drawCreated(event: L.LeafletEvent): void {
    const layer = (event as any).layer;
    this.featureGroup.addLayer(layer);
    this.geoJson = this.featureGroup.toGeoJSON() as GeoJSON.FeatureCollection;
    layer.options.id = layer._leaflet_id;
    this.options.push(layer.options);
    this.updateMap();
  }

  private drawEdited(event: L.LeafletEvent): void {
    const layers = (event as any).layers;
    layers.eachLayer((layer: any) => {
      this.featureGroup.addLayer(layer);
      layer.options.id = layer._leaflet_id;
      this.options.forEach((x, i) => {
        if (x.id === layer._leaflet_id) {
          this.options[i] = layer.options;
        }
      });
      this.geoJson = this.featureGroup.toGeoJSON() as GeoJSON.FeatureCollection;
      this.updateMap();
    });
  }

  private drawDeleted(event: L.LeafletEvent): void {
    const layers = (event as any).layers;
    layers.eachLayer((layer: { _leaflet_id: any }) => {
      this.options.forEach((x, i) => {
        if (x.id === layer._leaflet_id) {
          this.options.splice(i, 1);
        }
      });
    });
    this.geoJson = this.featureGroup.toGeoJSON() as GeoJSON.FeatureCollection;
    this.updateMap();
  }

  private styleChanged(element: any): void {
    this.options.forEach((x, i) => {
      if (x.id === (element as any).options.id) {
        this.options[i] = (element as any).options;
      }
    });
    this.geoJson = this.featureGroup.toGeoJSON() as GeoJSON.FeatureCollection;
    this.updateMap();
  }

  private getDrawConstructorOptions(
    featureGroup: L.FeatureGroup
  ): L.Control.DrawConstructorOptions {
    const polyline: L.DrawOptions.PolylineOptions = {
      metric: true,
      feet: false,
      shapeOptions: {
        color: 'black'
      },
      repeatMode: true
    };
    const polygon: L.DrawOptions.PolygonOptions = {
      allowIntersection: false
    };
    const rectangle: L.DrawOptions.RectangleOptions = {
      shapeOptions: {
        stroke: true,
        weight: 4,
        opacity: 0.5,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2
      }
    };
    const controlDrawOptions: L.Control.DrawOptions = {
      polyline: polyline,
      polygon: polygon,
      circle: false,
      circlemarker: false,
      rectangle: rectangle,
      marker: false
    };
    const controlEditOptions: L.Control.EditOptions = {
      featureGroup: featureGroup
    };
    const opts: L.Control.DrawConstructorOptions = {
      position: 'topright',
      draw: controlDrawOptions,
      edit: controlEditOptions
    };
    return opts;
  }
}
