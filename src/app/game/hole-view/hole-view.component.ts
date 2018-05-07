import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Game, Hole, Course } from '../../shared/datamodel';

import { GameService } from '../game.service';

//declare var google: any;

@Component({
  selector: 'app-hole-view',
  templateUrl: './hole-view.component.html',
  styleUrls: ['./hole-view.component.css']
})
export class HoleViewComponent implements OnInit {
  loaded:boolean = false;
  hole:Hole;
  game:any;

  selectedParticipant: any;
  selectedScore: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gs: GameService,
  ) { 
    let map;
    this.route.paramMap.subscribe(param => {
      this.gs.getGame(param.get('idgame')).then(game => {
        this.game = game;
        Promise.all([
          this.gs.getParticipantsDetail(game.participants).then(participant => game.participants=participant),
          this.gs.getHolesDetail(game.club, game.courseComplete.holes).then(holes => game.courseComplete.holes=holes)
        ]).then((result)=> {
          game.participants=result[0];
          game.courseComplete.holes=result[1];
          this.hole = game.courseComplete.holes[param.get('idhole')]
          this.selectedParticipant=game.participants[0];
          if(game['scores'][this.hole.holeId]){
            this.selectedScore = game['scores'][this.hole.holeId][this.selectedParticipant.uid];
          }
          else{
            this.selectedScore=0;
            this.gs.saveScore(this.game.id, this.hole.holeId, this.selectedParticipant.uid, Number(this.selectedScore), true);
          }
          this.loaded=true;
          // map = new google.maps.Map(document.getElementById('map'), {
          //   center: { lat: this.hole['detail'].gmid.latitude, lng: this.hole['detail'].gmid.longitude},
          //   zoom: 18,
          //   mapTypeId: 'hybrid'
          // });
        })
      });
    }
    )
  }

  ngOnInit() {

  }

  save(){
    this.gs.saveScore(this.game.id, this.hole.holeId, this.selectedParticipant.uid, Number(this.selectedScore));
  }

  back() {
    this.router.navigate(['/game/play', this.game.id])
  }

}
