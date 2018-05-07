import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { firestore } from "firebase/app";

declare var google: any;

import { Game, Hole, Course, Club, Facility } from '../../shared/datamodel';
import { ClubService } from '../club.service';

@Component({
  selector: 'app-course-editor',
  templateUrl: './course-editor.component.html',
  styleUrls: ['./course-editor.component.css']
})
export class CourseEditorComponent implements OnInit {
  @Input() club:Facility;
  courses:Course[];
  selectedCourse:Course;
  holes:Hole[];
  courseSize:any[];

  constructor(
    private cs:ClubService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.cs.getCourseList(this.club).then(courses => this.courses = courses);
    this.cs.getHoleList(this.club).then(holes => this.holes = holes);
    this.selectedCourse = null;
  }

  selectCourse(courseId: string) {
    this.cs.getCourseInfo(this.club, courseId).then(course => {
      this.selectedCourse = course;
    });
  }

  save(){
    this.cs.saveCourse(this.club, this.selectedCourse).then(result => {
      this.cs.getCourseList(this.club).then(courses => this.courses = courses);
    });
  }

  create(){
    this.cs.createCourse(this.club).then(course => {
      this.selectedCourse = course;
      this.cs.getCourseList(this.club).then(courses => this.courses = courses);
    } );
  }

  createReverse(){
    let courseAux:any;
    courseAux = Object.assign({}, this.selectedCourse);
    courseAux.name="Nouveau Parcours";
    for (let index = 0; index < 9; index++) {
      courseAux.holes[index] = this.selectedCourse.holes[index+9];
      courseAux.holes[index+9] = this.selectedCourse.holes[index]
    }
    console.log(courseAux);

    /*this.cs.saveNewCourse(this.club, courseAux).then(course => {
      this.selectedCourse = course;
      this.cs.getCourseList(this.club).then(courses => this.courses = courses);
    });*/
  }

  delete(){
    this.cs.deleteCourse(this.club, this.selectedCourse).then(result => {
      this.selectedCourse = null;
      this.cs.getCourseList(this.club).then(courses => this.courses = courses);
    });
  }

  onSizeChange(event:any){
    if(this.selectedCourse.holeNumber != this.selectedCourse.holes.length)
    {
      if(this.selectedCourse.holeNumber==9)
      {
        this.selectedCourse.holes = this.selectedCourse.holes.slice(0, this.selectedCourse.holeNumber);
      }
      else{
        for (let index = 0; index < 9; index++) {
          this.selectedCourse.holes.push({ num: index + 10, handicap: null, holeId: "" });
          
        }
      }
    }
  }

}
