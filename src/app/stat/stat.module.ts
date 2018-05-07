import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { StatRoutingModule } from './stat-routing.module';
import { StatComponent } from './stat.component';

@NgModule({
  imports: [
    CommonModule,
    StatRoutingModule,
    SharedModule
  ],
  declarations: [StatComponent]
})
export class StatModule { }
