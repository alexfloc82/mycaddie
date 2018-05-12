import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { firestore } from "firebase/app";

import { Observable } from 'rxjs/Observable';

declare var google: any;
var map;
var elevator;

import { Game, Hole, Course, Club, Facility } from '../../shared/datamodel';
import { ClubService } from '../club.service';

@Component({
  selector: 'app-hole-editor',
  templateUrl: './hole-editor.component.html',
  styleUrls: ['./hole-editor.component.css']
})
export class HoleEditorComponent implements OnInit {
  @Input() club: Facility;
  holes: Hole[];
  selectedHole: Hole;
  markerType: string;
  markers:any[];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cs: ClubService
  ) { 
    this.markers=[];
  }

  ngOnInit() {

  }

  ngOnChanges() {
    this.cs.getHoleList(this.club).then(holes => this.holes = holes);
    this.selectedHole = null;
    map = new google.maps.Map(document.getElementById('mapHole'), {
      center: { lat: this.club.position.latitude, lng: this.club.position.longitude },
      zoom: 18,
      mapTypeId: 'hybrid'
    });
    elevator = new google.maps.ElevationService;
    map.addListener('dblclick', (e) => {
      this.addMarker(e.latLng);
    });
    
  }

  selectHole(holeId: string) {
    this.cs.getHoleInfo(this.club, holeId).then(hole => {
      this.selectedHole = hole;
      this.markers.forEach(marker => marker.setMap(null));
      this.markers=[];
      map.setCenter({ lat: this.selectedHole.gmid.latitude, lng: this.selectedHole.gmid.longitude });
      this.showMarkers();
      
    });
  }

  showMarkers() {
    if (this.selectedHole.gnear) {
      this.makeMarker({ lat: this.selectedHole.gnear.latitude, lng: this.selectedHole.gnear.longitude }, 'G-E', 'Entrée green', 'gnear')
    }

    if (this.selectedHole.gfar) {
      this.makeMarker({ lat: this.selectedHole.gfar.latitude, lng: this.selectedHole.gfar.longitude }, 'G-S', 'Sortie du green', 'gfar')
    }

    if (this.selectedHole.gmid) {
      this.makeMarker({ lat: this.selectedHole.gmid.latitude, lng: this.selectedHole.gmid.longitude }, 'G-M', 'Milieu du green', 'gmid')
    }

    if (this.selectedHole.hole) {
      this.makeMarker({ lat: this.selectedHole.hole.latitude, lng: this.selectedHole.hole.longitude }, 'T', 'Trou', 'hole')
    }

    if (this.selectedHole['B1']) {
      this.makeMarker({ lat: this.selectedHole['B1'].latitude, lng: this.selectedHole['B1'].longitude }, 'B1', 'Bunker', 'hole')
    }
    if (this.selectedHole['B2']) {
      this.makeMarker({ lat: this.selectedHole['B2'].latitude, lng: this.selectedHole['B2'].longitude }, 'B2', 'Bunker', 'hole')
    }
    if (this.selectedHole['B3']) {
      this.makeMarker({ lat: this.selectedHole['B3'].latitude, lng: this.selectedHole['B3'].longitude }, 'B3', 'Bunker', 'hole')
    }
    if (this.selectedHole['B4']) {
      this.makeMarker({ lat: this.selectedHole['B4'].latitude, lng: this.selectedHole['B4'].longitude }, 'B4', 'Bunker', 'hole')
    }
  }

  addMarker(LatLng: any) {
    let label;
    switch (this.markerType) {
      case 'gnear':
        label = 'G-E';
        break;
      case 'gfar':
        label = 'G-S';
        break;
      case 'gmid':
        label = 'G-M';
        elevator.getElevationForLocations({'locations': [LatLng]}, (results, status) => this.selectedHole['elevation'] = results[0].elevation);
        
        break;
      case 'hole':
        label = 'T';
        break;
      default:
        label = this.markerType;
        break;
    }
    this.selectedHole[this.markerType] = new firestore.GeoPoint(LatLng.lat(), LatLng.lng());
    this.makeMarker(LatLng, label, 'default', this.markerType);
  }

  makeMarker(LatLng: any, label: string, title: string, property: string) {
    var mark = new google.maps.Marker({ position: LatLng, map: map, label: label });
    mark.addListener('dblclick', (e) => {
      mark.setMap(null);
      delete this.selectedHole[property];
    });
    this.markers.push(mark);

  }

  save(){
    this.cs.saveHole(this.club, this.selectedHole).then(result => {
      this.cs.getHoleList(this.club).then(holes => this.holes = holes);
    });
  }

  create(){
    this.cs.createHole(this.club).then(hole => {
      this.selectedHole = hole;
      this.clearMarkers();
      this.cs.getHoleList(this.club).then(holes => this.holes = holes);
    } );
  }

  delete(){
    this.cs.deleteHole(this.club, this.selectedHole).then(result => {
      this.selectedHole = null;
      this.clearMarkers();
      this.cs.getHoleList(this.club).then(holes => this.holes = holes);
    });
  }

  clearMarkers(){
    this.markers.forEach(mark => mark.setMap(null));
  }

}
