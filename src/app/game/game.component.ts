import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpeechRecognitionService } from '../shared/speech.service';

import { Game, Hole, Course } from '../shared/datamodel';

import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  speechOn: boolean;
  game: Game;
  scores: any[];
  loaded: boolean = false;

  total: any;
  totalBrut: any;
  totalNet: any;
  parTotal: number;

  totali: any;
  totaliBrut: any;
  totaliNet: any;
  parTotali: number;

  totalo: any;
  totaloBrut: any;
  totaloNet: any;
  parTotalo: number;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gs: GameService,
    private speechRecognitionService: SpeechRecognitionService
  ) {
    this.route.paramMap.subscribe(param => {
      this.gs.getGame(param.get('idgame')).then(game => {
        this.game = game;
        console.log(game);
        Promise.all([
          this.gs.getParticipantsDetail(game.participants).then(participant => game.participants = participant),
          this.gs.getHolesDetail(game.club, game.courseComplete.holes).then(holes => game.courseComplete.holes = holes)
        ]).then((result) => {
          game.participants = result[0];
          game.courseComplete.holes = result[1];
          this.calculateTotal();
          this.loaded = true;
        })
      });
    }
    )
  }

  ngOnInit() {
    this.speechOn = true;
  }

  ngOnDestroy() {
    this.speechOn = false;
    this.speechRecognitionService.DestroySpeechObject();
  }

  launchSpeech() {
    this.speechRecognitionService.record().subscribe(
      (value) => { console.log(value), this.speechRecognitionService.speak(value); },
      (err) => { console.log(err); this.launchSpeech(); },
      () => {
        console.log("--complete--");
        if (this.speechOn) { this.launchSpeech() };
      }
    );
  }

  back() {
    this.router.navigate(['/game'])
  }

  holeDetail(num: number) {
    this.router.navigate([this.router.url, 'hole', num])
  }

  calculateTotal() {
    this.total = {};
    this.totalBrut = {};
    this.totalNet = {};

    this.totali = {};
    this.totaliBrut = {};
    this.totaliNet = {};

    this.totalo = {};
    this.totaloBrut = {};
    this.totaloNet = {};

    this.game.participants.forEach(participant => {
      this.total[participant['uid']] = 0;
      this.totalBrut[participant['uid']] = 0;
      this.totalNet[participant['uid']] = 0;

      this.totali[participant['uid']] = 0;
      this.totaliBrut[participant['uid']] = 0;
      this.totaliNet[participant['uid']] = 0;

      this.totalo[participant['uid']] = 0;
      this.totaloBrut[participant['uid']] = 0;
      this.totaloNet[participant['uid']] = 0;

      this.game.courseComplete.holes.forEach((hole, index) => {
        if (this.game['scores'][hole.detail.holeId]) {
          if (this.game['scores'][hole.detail.holeId][participant['uid']]) {
            this.total[participant['uid']] = this.total[participant['uid']] + this.game['scores'][hole.detail.holeId][participant['uid']];
            this.totalNet[participant['uid']] = this.totalNet[participant['uid']] + this.calculateNetPoints(hole.handicap, participant['handicap'], participant['tees'], participant['gender'], hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
            this.totalBrut[participant['uid']] = this.totalBrut[participant['uid']] + this.calculateGrossPoints(hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);

            if (index < 9) {
              this.totali[participant['uid']] = this.totali[participant['uid']] + this.game['scores'][hole.detail.holeId][participant['uid']];
              this.totaliNet[participant['uid']] = this.totaliNet[participant['uid']] + this.calculateNetPoints(hole.handicap, participant['handicap'], participant['tees'], participant['gender'], hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
              this.totaliBrut[participant['uid']] = this.totaliBrut[participant['uid']] + this.calculateGrossPoints(hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
            }
            if (index >= 9) {
              this.totalo[participant['uid']] = this.totalo[participant['uid']] + this.game['scores'][hole.detail.holeId][participant['uid']];
              this.totaloNet[participant['uid']] = this.totaloNet[participant['uid']] + this.calculateNetPoints(hole.handicap, participant['handicap'], participant['tees'], participant['gender'], hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
              this.totaloBrut[participant['uid']] = this.totaloBrut[participant['uid']] + this.calculateGrossPoints(hole.detail.par, this.game['scores'][hole.detail.holeId][participant['uid']]);
            }
          }
        }
      });
    });

    this.parTotal = 0;
    this.parTotali = 0;
    this.parTotalo = 0;
    this.game.courseComplete.holes.forEach((hole, index) => {
      if (hole.detail.par) {
        this.parTotal = this.parTotal + hole.detail.par;

        if (index < 9) {
          this.parTotali = this.parTotali + hole.detail.par;
        }
        if (index >= 9) {
          this.parTotalo = this.parTotalo + hole.detail.par;
        }
      }
    });
  }

  end(status: boolean) {
    this.gs.setStatus(this.game['id'], status).then(res => this.back());
  }

  calculateNetPoints(holeh: number, playerh: number, playert: string, playerg: string, holePar: number, playerScore: number) {
    let playerhcourse: number;
    let sss: number;
    let slope: number;

    if (playerg == "male") {
      switch (playert) {
        case "B":
          slope = this.game.courseComplete.slope_MB;
          sss = this.game.courseComplete.sss_MB;
          break;
        case "Y":
        slope = this.game.courseComplete.slope_MY;
        sss = this.game.courseComplete.sss_MY;
          break;
        case "Bl":
        slope = this.game.courseComplete.slope_MBl;
        sss = this.game.courseComplete.sss_MBl;
          break;
        case "R":
        slope = this.game.courseComplete.slope_MR;
        sss = this.game.courseComplete.sss_MR;
          break;

        default:
          break;
      }
    }
    else {
      switch (playert) {
        case "Y":
        slope = this.game.courseComplete.slope_FY;
        sss = this.game.courseComplete.sss_FY;
          break;
        case "Bl":
        slope = this.game.courseComplete.slope_FBl;
        sss = this.game.courseComplete.sss_FBl;
          break;
        case "R":
        slope = this.game.courseComplete.slope_FR;
        sss = this.game.courseComplete.sss_FR;
          break;

        default:
          break;
      }
    }

    playerhcourse = Math.ceil((playerh * slope ) / 113 + ( sss - this.parTotal));


    let CR = 0;
    if (playerhcourse <= 18) {
      if (holeh <= playerhcourse) {
        CR = 1;
      }
    } else {
      if (holeh <= playerhcourse - 18) {
        CR = 2;
      } else {
        CR = 1;
      }
    }
    return Math.max(holePar - playerScore + 2 + CR, 0);

  }

  calculateGrossPoints(holePar: number, playerScore: number) {
    return Math.max(holePar - playerScore + 2, 0);
  }
}
