import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule }   from '@angular/forms';

import { GameRoutingModule } from './game-routing.module';
import { GameHistoryComponent } from './game-history/game-history.component';
import { GameComponent } from './game.component';
import { GameService } from './game.service';
import { GameCardComponent } from './game-card/game-card.component';
import { HoleViewComponent } from './hole-view/hole-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    GameRoutingModule
  ],
  declarations: [
    GameHistoryComponent,
    GameComponent,
    GameCardComponent,
    HoleViewComponent
  ],
  providers: []
})
export class GameModule { }
