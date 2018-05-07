import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRouteModule} from './app.route.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SharedModule} from './shared/shared.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { AuthService } from './shared/auth.service';
import {SpeechRecognitionService} from './shared/speech.service';
import { GameService } from './game/game.service';
import { HomeComponent } from './home/home.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// the second parameter 'fr' is optional
registerLocaleData(localeFr,'fr');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule, AppRouteModule, BrowserAnimationsModule, SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, AngularFireAuthModule
  ],
  providers: [AuthService, SpeechRecognitionService, GameService, { provide: LOCALE_ID, useValue: 'fr' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
