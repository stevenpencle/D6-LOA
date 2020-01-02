import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterContentInit
} from '@angular/core';
import { Map, TileLayer, LatLng } from 'leaflet';
// import * as L from 'leaflet';
// import { featureGroup } from 'leaflet';
// import 'leaflet-draw-ng';
// import { stringify } from 'wellknown';
// import 'leaflet-styleeditor';
import { ISampleMap } from 'src/app/model/model';
import { SampleMapStoreService } from './sample-map-store.service';

@Component({
  selector: 'app-sample-map',
  templateUrl: './sample-map.component.html'
})
export class SampleMapComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() projectLocationInfo: any;
  @ViewChild('mapContainer', { static: true })
  private mapContainer: ElementRef<HTMLDivElement>;
  map: Map;
  json: any;
  GeoJson: any;
  wktMap: string[];
  Options = [];
  sampleMap: ISampleMap = {};

  constructor(private sampleMapStoreService: SampleMapStoreService) {}

  ngAfterContentInit() {
    // this.map = new Map(this.mapContainer.nativeElement);
    // this.map.createPane('base', this.mapContainer.nativeElement);
    // // this.map = new Map('mapContainer');
    // const baseMapUrl =
    //   'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
    // const baseMapLayer = new TileLayer(baseMapUrl, {
    //   maxZoom: 18
    // });
    // this.map.addLayer(baseMapLayer);
    // this.map.setView(new LatLng(30.439794, -84.290886), 12);
  }

  ngOnInit() {
    //     const baseMapUrl =
    //         'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    //       baseMapTileLayer = new L.TileLayer(baseMapUrl, { maxZoom: 18 }),
    //       map = new L.Map('map', {
    //         layers: [baseMapTileLayer],
    //         center: new L.LatLng(30.439794, -84.290886),
    //         zoom: 12
    //       });
    //     let editableLayers = new L.featureGroup();
    //     this.sampleMapStoreService.safeSubscribe(
    //       this,
    //       samples => {
    //         if (samples.length > 0) {
    //           this.sampleMap.id = samples[0].id;
    //           this.projectLocationInfo = samples[0].mapCoordinates;
    //         }
    //         // let parse = require('wellknown');
    //         if (
    //           this.projectLocationInfo !== undefined &&
    //           this.projectLocationInfo != null
    //         ) {
    //           const items = this.projectLocationInfo.split('~');
    //           for (let i = 0; i < items.length; i++) {
    //             let itemOptions = items[i].split(',Options:')[1];
    //             var drawItem = items[i].split(',Options:')[0];
    //             console.log('drawItem');
    //             console.log(drawItem);
    //             map.addLayer(
    //               L.geoJSON(parse(drawItem), {
    //                 onEachFeature: (feature, layer) => {
    //                   // Set style for each layer on the map if exists
    //                   if (layer.setStyle !== undefined) {
    //                     layer.setStyle(JSON.parse(itemOptions));
    //                     this.Options[i] = JSON.parse(itemOptions);
    //                   }
    //                   // Set popup for each layer on the map if exists
    //                   if (layer.bindPopup != undefined) {
    //                     layer
    //                       .bindPopup(JSON.parse(itemOptions).popupContent)
    //                       .openPopup();
    //                   }
    //                   editableLayers.addLayer(layer);
    //                   console.log(editableLayers);
    //                 }
    //               }).addTo(map)
    //             );
    //           }
    //           // moving the focus of the map to first element.
    //           const coordinates = parse(drawItem).coordinates;
    //           if (coordinates.length === 2) {
    //             map.flyTo([coordinates[1], coordinates[0]], 12);
    //           } else if (coordinates.length > 2) {
    //             map.flyTo([coordinates[0][1], coordinates[0][0]], 12);
    //           }
    //         }
    //       },
    //       () => {
    //         this.sampleMapStoreService.load();
    //       }
    //     );
    //     // Customize style editor options
    //     const styleEditor = L.control.styleEditor({
    //       position: 'topleft',
    //       useGrouping: false,
    //       colorRamp: ['#1abc9c', '#2ecc71', '#3498db'],
    //       openOnLeafletDraw: false
    //     });
    //     map.addControl(styleEditor);
    //     map.addLayer(editableLayers);
    //     // Customize leaflet Draw
    //     const options = {
    //       position: 'topright',
    //       draw: {
    //         polyline: {
    //           metric: false,
    //           feet: false,
    //           shapeOptions: {
    //             color: 'black'
    //           },
    //           repeatMode: true
    //         },
    //         polygon: {
    //           allowIntersection: false // Restricts shapes to simple polygons
    //         },
    //         circle: false, // Turns off this drawing tool
    //         circlemarker: false,
    //         rectangle: {
    //           shapeOptions: {
    //             clickable: false
    //           }
    //         },
    //         marker: false
    //       },
    //       edit: {
    //         featureGroup: editableLayers // REQUIRED!!
    //       }
    //     };
    //     const drawControl = new L.Control.Draw(options);
    //     map.addControl(drawControl);
    //     map.on(L.Draw.Event.CREATED, e => {
    //       const type = e.layerType,
    //         layer = e.layer;
    //       console.log(layer);
    //       editableLayers.addLayer(layer);
    //       this.GeoJson = editableLayers.toGeoJSON();
    //       layer.options.id = layer._leaflet_id;
    //       this.Options.push(layer.options);
    //       console.log(this.wktMap, this.Options);
    //       this.updateMap();
    //     });
    //     map.on('draw:edited', e => {
    //       const layers = e.layers;
    //       layers.eachLayer(layer => {
    //         console.log(layer);
    //         if (layer instanceof L.Rectangle) {
    //           console.log('im an instance of L rectangle');
    //         }
    //         if (layer instanceof L.Polygon) {
    //           console.log('im an instance of L polygon');
    //         }
    //         if (layer instanceof L.Polyline) {
    //           console.log('im an instance of L polyline');
    //         }
    //         editableLayers.addLayer(layer);
    //         layer.options.id = layer._leaflet_id;
    //         this.Options.forEach((x, i) => {
    //           if (x.id === layer._leaflet_id) {
    //             this.Options[i] = layer.options;
    //           }
    //         });
    //         // this.Options.push(layer.options);
    //         this.GeoJson = editableLayers.toGeoJSON();
    //         this.updateMap();
    //       });
    //     });
    //     map.on('draw:deleted', e => {
    //       const layers = e.layers;
    //       layers.eachLayer(layer => {
    //         this.Options.forEach((x, i) => {
    //           if (x.id === layer._leaflet_id) {
    //             this.Options.splice(i, 1);
    //           }
    //         });
    //         console.log('remove');
    //       });
    //       this.GeoJson = editableLayers.toGeoJSON();
    //       this.updateMap();
    //     });
    //     map.on('styleeditor:changed', element => {
    //       this.Options.forEach((x, i) => {
    //         if (x.id === element.options.id) {
    //           this.Options[i] = element.options;
    //         }
    //       });
    //       this.GeoJson = editableLayers.toGeoJSON();
    //       this.updateMap();
    //     });
  }

  ngOnDestroy(): void {}

  saveMap(): void {}

  //   updateMap(): void {
  //     const wkt = new Array();
  //     for (let i = 0; i < this.GeoJson.features.length; i++) {
  //         console.log(stringify(this.GeoJson.features[i].geometry));
  //         console.log(this.Options[i]);
  //         wkt.push(
  //           stringify(this.GeoJson.features[i].geometry) +
  //             ',Options:' +
  //             JSON.stringify(this.Options[i])
  //         );
  //     }

  //     console.log(wkt);
  //     this.json = wkt;
  //   }

  //   saveMap(): void {
  //     if (this.json !== undefined) {
  //       this.sampleMap.mapCoordinates = this.json[0];
  //       for (let i = 1; i < this.json.length; i++) {
  //         this.sampleMap.mapCoordinates += '~' + this.json[i];
  //       }
  //     }
  //     this.addNewApplication();
  //     console.log(this.json);
  //   }

  //   addNewApplication() {
  //     this.sampleMapStoreService.add(
  //       this.sampleMap,
  //       () => {
  //         alert('Update the Map Successfully');
  //       },
  //       () => {}
  //     );
  //   }
}
