import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../shared/auth.service';

import { ClubEditorComponent } from './club-editor/club-editor.component';
import { HoleEditorComponent } from './hole-editor/hole-editor.component';
import { CourseEditorComponent } from './course-editor/course-editor.component';

const routes: Routes = [
  {path:'', redirectTo:'clubeditor'},
  {path:'clubeditor', component: ClubEditorComponent,children:[
    {path:'', redirectTo:'course'},
    {path:'hole', component: HoleEditorComponent },
    {path:'course', component: CourseEditorComponent},
  ]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClubAdminRoutingModule { }
