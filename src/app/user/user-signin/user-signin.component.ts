import { Component, OnInit } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { Router } from '@angular/router';

import {User} from '../../shared/datamodel';
import {AuthService} from '../../shared/auth.service';

@Component({
  selector: 'app-user-signin',
  templateUrl: './user-signin.component.html',
  styleUrls: ['./user-signin.component.css'],
  animations:[
    trigger('slide', [
      state('done', style({transform:'translateX(-100%)'})),
      state('current', style({transform:'translateX(0%)'})),
      state('next', style({transform:'translateX(100%)'})),
      transition('* => *', animate('300ms ease-out'))
    ])
  ]
})
export class UserSigninComponent implements OnInit {
  display1: string;
  display2: string;
  display3: string;
  form: User;
  username: string;

  constructor(
    private auth:AuthService,
    public router: Router
  ) { 
    this.form = new User;
    this.username = '';
  }

  ngOnInit() {
    this.display1 = 'current';
    this.display2 = 'next';
    this.display3 = 'next';
  }

  login() {
    this.router.navigate(['/user', 'login']);
  }

  createUser(){
    //to be commented in production
    // this.display2 = 'done';
    // this.display3 = 'current';
    // this.username = this.form.name;

    //to be uncommented on production
    this.auth.signup(this.form).then(user => 
      {
        this.username = user.name;
        this.display2 = 'done';
        this.display3 = 'current';
      });
  }

}
