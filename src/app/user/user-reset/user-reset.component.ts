import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
//import { MessageService } from '../../core/message/message.service';

@Component({
  selector: 'app-user-reset',
  templateUrl: './user-reset.component.html',
  styleUrls: ['./user-reset.component.css']
})
export class UserResetComponent implements OnInit {
  loader = false;
  email: string;
  password: string;
  confirm: string;

  constructor(public authService: AuthService,
    private auth: AngularFireAuth,
    private router: Router,
    //private messageService: MessageService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe(user => this.email = user.email);
  }

  resetPassword() {
    if (this.password == this.confirm) {
      this.authService.resetPass(this.password)
      .then(a => this.router.navigate(['/login']))
      .catch(err => console.log(err));
    }
    else {
      //this.messageService.sendMessage('La contraseña no coincide', 'error');
    }
  }

}