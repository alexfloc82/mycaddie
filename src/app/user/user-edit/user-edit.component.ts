import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { User, Club, Friend } from '../../shared/datamodel';

import { AuthService } from '../../shared/auth.service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Event } from '@angular/router';

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
  friendSearch: string = 'next';

  user: User;
  uid: string;

  contacts: any[];
  displayContacts: any[];
  searchedContacts: any[];

  loader: boolean = false;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) {
    this.loader = true;
    auth.user.subscribe(user => {
      this.uid = user.uid;
      this.afs.collection('users').doc<User>(this.uid).valueChanges().subscribe(user => {
        this.user = user;
        this.contacts = [];
        if (this.user.friends) {
          this.user.friends.forEach((friend, index, friends) =>
            this.afs.collection('users').doc(friend.uid).snapshotChanges().subscribe(snap => {
              this.contacts.push(snap.payload.data());
              if (index == friends.length - 1) {
                this.displayContacts = this.contacts;
                this.loader = false;
              }
            }
            )
          );
        }
      })
    })
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

  onFilter(filter: UIEvent) {
    this.displayContacts = this.contacts.filter(contact =>
      (contact.fullname.toLowerCase().indexOf(filter.target['value'].toLowerCase()) > -1 || filter.target['value'] == ""))
  }

  newFriend() {
    this.community = 'done';
    this.friendSearch = 'current';
  }

  back() {
    this.afs.collection('users').doc(this.uid).set(this.user).then(a => {
      this.community = 'current';
      this.friendSearch = 'next';
    })

  }

  onSearch(filter: UIEvent) {
    this.searchedContacts = [];
    this.afs.collection('users').snapshotChanges().subscribe(snaps => {
      snaps.filter(snap =>
        (snap.payload.doc.data().fullname.toLowerCase().indexOf(filter.target['value'].toLowerCase()) > -1 || filter.target['value'] == ""))
        .forEach(snap => {
          this.searchedContacts.push(snap.payload.doc.data())
        })
    }
    )
  }

  addFriend(f_uid: string) {
    let friend = new Friend();
    friend.uid = f_uid;
    friend.isAccepted = false;

    if (!this.contacts.find(contact => contact.uid == friend.uid)) {
      let newFriend = Object.assign({}, friend);
      this.user.friends.push(newFriend);
      this.back();
    }


  }

}
