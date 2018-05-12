import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent} from './home/home.component';
import { AuthService } from './shared/auth.service';

export const routes: Routes = [
  { path: '',  redirectTo:'game', pathMatch: 'full' },  
  { path: 'home',   component: HomeComponent, canActivate: [AuthService]  },  
  { path: 'game',  loadChildren: 'app/game/game.module#GameModule', canActivate: [AuthService] }, 
  { path: 'stat',  loadChildren: 'app/stat/stat.module#StatModule', canActivate: [AuthService]},
  { path: 'user',  loadChildren: 'app/user/user.module#UserModule'},
  { path: 'clubadmin',  loadChildren: 'app/club-admin/club-admin.module#ClubAdminModule'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule {}