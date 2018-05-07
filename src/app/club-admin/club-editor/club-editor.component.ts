import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { firestore } from "firebase/app";

declare var google: any;

import { Game, Hole, Course, Club, Facility } from '../../shared/datamodel';
import { ClubService } from '../club.service';

@Component({
  selector: 'app-club-editor',
  templateUrl: './club-editor.component.html',
  styleUrls: ['./club-editor.component.css']
})
export class ClubEditorComponent implements OnInit {
  clubs: Facility[];
  selectClub: Facility;
  map: any;
  loader: boolean = false;

  course: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cs: ClubService
  ) {
  }

  ngOnInit() {
    this.cs.getClubList().then(clubs => {
      this.clubs = clubs;
    });
  }

  onClubChange(event) {
    let map;
    if (event.target.value == 'new') {
      this.loader = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.loader = false;
        this.selectClub = new Facility(position.coords.latitude, position.coords.longitude);
        map = new google.maps.Map(document.getElementById('mapClub'), {
          center: { lat: position.coords.latitude, lng: position.coords.longitude },
          zoom: 15,
          mapTypeId: 'hybrid'
        });
        map.addListener('click', (e) => {
          if (e.placeId) {
            let service = new google.maps.places.PlacesService(map);
            service.getDetails({ placeId: e.placeId }, result => this.clubFromMap(result));
          }
        });
      }, error => console.log(error), {
          maximumAge: 10000
        })
    }
    else {
      this.cs.getClubInfo(event.target.value).then(result => {
        this.selectClub = result;
        map = new google.maps.Map(document.getElementById('mapClub'), {
          center: { lat: this.selectClub.position.latitude, lng: this.selectClub.position.longitude },
          zoom: 15,
          mapTypeId: 'hybrid'
        });
        map.addListener('click', (e) => {
          if (e.placeId) {
            let service = new google.maps.places.PlacesService(map);
            service.getDetails({ placeId: e.placeId }, result => this.clubFromMap(result));
          }
        });
      });
    }
  }

  clubFromMap(result: any) {
    this.selectClub.address = result['formatted_address'];
    this.selectClub.tel = result['international_phone_number'];
    this.selectClub.web = result['website'];
    this.selectClub.name = result['name'];
    this.selectClub.clubId = result.place_id;
    this.selectClub.position = new firestore.GeoPoint(result.geometry.location.lat(), result.geometry.location.lng());
    console.log(result)
  }

  save() {
    this.cs.saveClub(this.selectClub).then(res => {
      console.log(res);
      this.cs.getClubList().then(clubs => {
        this.clubs = clubs;
      });
    }
    );
  }

}
