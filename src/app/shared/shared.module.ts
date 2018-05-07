import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {ClubPipe} from './club.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    ClubPipe
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    ClubPipe
  ],
})
export class SharedModule { }
