import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-o-auth-login',
  templateUrl: './o-auth.component.html',
  styleUrls: ['./o-auth.component.css']
})
export class OAuthComponent implements OnInit {
  documents: any[];
  email: string;
  password: string;

  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope: string;
  state: string;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap => {
      this.response_type = paramMap.get('response_type');
      this.client_id = paramMap.get('client_id');
      this.redirect_uri = paramMap.get('redirect_uri');
      this.scope = paramMap.get('scope');
      this.state = paramMap.get('state');
      })
  }

  loginWithGoogle(){
    this.auth.loginWithGoogle(this.scope).then(a => {
      console.log(a);
      let url= this.redirect_uri
        +'#access_token='+a
        +'&state='+ this.state
        +'&token_type=bearer&code=ok';
      window.location.href =url;
      //window.open(url);
    });

  }

}