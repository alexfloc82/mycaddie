import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../shared/auth.service';

import { StatComponent } from './stat.component';

const routes: Routes = [
  {path:'', redirectTo:'history'},
  {path:'history', component: StatComponent, canActivate: [AuthService]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatRoutingModule { }
