import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { UserRoutingModule } from './user-routing.module';
import { UserSigninComponent } from './user-signin/user-signin.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserForgotComponent } from './user-forgot/user-forgot.component';
import { UserResetComponent } from './user-reset/user-reset.component';
import { OAuthComponent } from './o-auth/o-auth.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    SharedModule,HttpClientModule
  ],
  declarations: [UserSigninComponent, UserLoginComponent, UserEditComponent, UserForgotComponent, UserResetComponent, OAuthComponent],
  providers: []
})
export class UserModule { }
