import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { User, Club, Friend } from '../../shared/datamodel';

import { AuthService } from '../../shared/auth.service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  animations: [
    trigger('slide', [
      state('done', style({ transform: 'translateX(-100%)' })),
      state('current', style({ transform: 'translateX(0%)' })),
      state('next', style({ transform: 'translateX(101%)' })),
      transition('* => *', animate('300ms ease-out'))
    ])
  ]
})
export class UserEditComponent implements OnInit {
  menu: string = 'current';
  profile: string = 'next';
  equipment: string = 'next';
  community: string = 'next';
  user: User;
  uid: string;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
  ) {
    auth.user.subscribe(user => this.uid = user.uid);
    auth.userProfile.subscribe(user => this.user = user);
  }

  ngOnInit() {
  }

  save() {
    this.afs.collection('users').doc(this.uid).set(this.user).then(a => {
      this.menu = 'current';
      this.profile = 'next';
      this.community = 'next';
      this.equipment = 'next';
    })

  }
  
  getColor(value: string): string {
    switch (value) {
        case 'I':
        case 'H':
            return "url('../../assets/bck-img/iron.jpg')";
        case 'W':
            return "url('../../assets/bck-img/wood.jpeg')";
        case 'S':
        return "url('../../assets/bck-img/sand.jpg')";
        case 'P':
        return "url('../../assets/bck-img/green.jpg')";
        case 'D':
            return "url('../../assets/bck-img/tee.jpg')";
        case 'J':
        return "url('../../assets/bck-img/grass.jpeg')";
        default:
            return 'Autres';
    }
}
}
