import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserSigninComponent } from './user-signin/user-signin.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserForgotComponent } from './user-forgot/user-forgot.component';
import { UserResetComponent } from './user-reset/user-reset.component';
import { OAuthComponent } from './o-auth/o-auth.component';

import { AuthService } from '../shared/auth.service';

const routes: Routes = [
  { path: '',  redirectTo:'login', pathMatch: 'full' },  
  { path: 'login',    component: UserLoginComponent },
  { path: 'signin',    component: UserSigninComponent },
  { path: 'edit',    component: UserEditComponent, canActivate: [AuthService] },
  { path: 'forgot',    component: UserForgotComponent },
  { path: 'auth',    component: OAuthComponent },
  { path: 'reset',    component: UserResetComponent, canActivate: [AuthService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
