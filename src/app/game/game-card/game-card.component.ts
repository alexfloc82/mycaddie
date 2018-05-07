import { Component, OnInit, Input } from '@angular/core';
import {GameService} from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {
  @Input() gameId:string;
  game:any;
  loader:boolean=false;

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.gameService.getGame(this.gameId).then(game => {
      this.game = game;
      this.loader=true;
    });
  }

  navigate(){
    this.router.navigate(['/game', 'play', this.gameId]);
  }

}
