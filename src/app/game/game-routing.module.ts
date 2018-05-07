import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../shared/auth.service';

import { GameHistoryComponent } from './game-history/game-history.component';
import { GameComponent } from './game.component';
import { HoleViewComponent } from './hole-view/hole-view.component';

const routes: Routes = [
  {path:'', redirectTo:'history'},
  {path:'history', component: GameHistoryComponent, canActivate: [AuthService]  },
  {path: 'play/:idgame', component: GameComponent, canActivate: [AuthService] },
  {path: 'play/:idgame/hole/:idhole', component: HoleViewComponent, canActivate: [AuthService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
