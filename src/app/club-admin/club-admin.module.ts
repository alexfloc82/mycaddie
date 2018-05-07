import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule }   from '@angular/forms';

import { ClubAdminRoutingModule } from './club-admin-routing.module';
import { ClubEditorComponent } from './club-editor/club-editor.component';
import { HoleEditorComponent } from './hole-editor/hole-editor.component';
import { CourseEditorComponent } from './course-editor/course-editor.component';
import { ClubService } from './club.service';

@NgModule({
  imports: [
    CommonModule,
    ClubAdminRoutingModule,SharedModule,FormsModule
  ],
  declarations: [ClubEditorComponent, HoleEditorComponent, CourseEditorComponent],
  providers: [ClubService]
})
export class ClubAdminModule { }
