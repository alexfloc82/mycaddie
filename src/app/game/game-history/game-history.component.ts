import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

import { User, Game, Facility, Course } from '../../shared/datamodel';

import { AuthService } from '../../shared/auth.service';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.css'],
  animations: [
    trigger('slide', [
      state('done', style({ transform: 'translateX(-100%)' })),
      state('current', style({ transform: 'translateX(0%)' })),
      state('next', style({ transform: 'translateX(101%)' })),
      transition('* => *', animate('300ms ease-out'))
    ])
  ]
})
export class GameHistoryComponent implements OnInit {
  menu: string = 'current';
  course: string = 'next';
  teams: string = 'next';
  clubs:Facility[];
  courses:Course[];

  currentUserInfo:User;

  newGame: Game;
  userGames: any;

  firstHole:string;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private router: Router
  ) { 
    this.newGame = new Game;
    this.afs.collection<Facility>('clubs').valueChanges().subscribe(clubs => this.clubs=clubs);
    auth.user.subscribe(user => {
      this.newGame.participants.push(user.uid);
      this.afs
      .collection<Game>('games', query => query.where(user.uid, '==', true).limit(10))
      .snapshotChanges()
      .subscribe(games => {
        this.userGames = games;
      }
      );

      this.afs.collection('users').doc<User>(user.uid).valueChanges().subscribe(user => this.currentUserInfo = user);
    });
    
  }

  ngOnInit() {
  }

  save(){
    let newGame = Object.assign({}, this.newGame);
    newGame.participants.forEach(part => newGame[part]=true);
    newGame.currentHole = this.firstHole;
    this.afs.collection('games').add(newGame).then(a => {
      this.afs.collection('games').doc(a.id).update({id:a.id}).then(v => this.router.navigate(['/game', 'play', a.id]))
      
    })
  }

  onClubSelect(){
    this.afs.collection<Facility>('clubs').doc(this.newGame.club).collection<Course>('courses', quer => quer.orderBy('name'))
    .valueChanges().subscribe(courses => {
      this.courses=courses;
      this.newGame.course = courses[0].courseId;
      this.firstHole= courses[0].holes[0]['holeId'];
    });
  }

  onCourseSelect(){
    this.afs.collection<Facility>('clubs').doc(this.newGame.club).collection('courses').doc<Course>(this.newGame.course)
    .valueChanges().subscribe(course =>this.firstHole= course.holes[0]['holeId']);
  }

}
