import { Injectable } from '@angular/core';
import { User, Course, Hole, Game, Facility } from '../shared/datamodel';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable()
export class ClubService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getClubList() {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('clubs').snapshotChanges().subscribe(snaps => {
        let value = [];
        snaps.forEach(snap => {
          let doc = snap.payload.doc.data();
          value.push(doc);
        });
        resolve(value);
      });
    })
  }

  getClubInfo(club: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('clubs').doc(club).valueChanges().subscribe(snap => {
        resolve(snap);
      });
    })
  }

  saveClub(club: Facility) {
    return this.afs.collection('clubs').doc(club.clubId).set(club);
  }

  getHoleList(club: Facility) {
    return new Promise<Hole[]>((resolve, reject) => {
      this.afs.collection('clubs').doc(club.clubId).collection<Hole>('holes', ref => ref.orderBy('num')).valueChanges().subscribe(snaps => {
        resolve(snaps);
      });
    })
  }

  getHoleInfo(club: Facility, hole: string) {
    return new Promise<Hole>((resolve, reject) => {
      this.afs.collection('clubs').doc(club.clubId).collection('holes').doc<Hole>(hole).valueChanges().subscribe(snap => {
        resolve(snap);
      });
    })
  }

  saveHole(club: Facility, hole: Hole) {
    let holeObj = Object.assign({}, hole);
    return this.afs.collection('clubs').doc(club.clubId).collection('holes').doc(hole.holeId).set(holeObj);
  }

  createHole(club: Facility) {
    let hole = new Hole();
    let holeObj = Object.assign({}, hole);
    return new Promise<Hole>((resolve, reject) =>
      this.afs.collection('clubs').doc(club.clubId).collection<Hole>('holes').add(holeObj).then(docRef => {
        hole.holeId = docRef.id;
        resolve(hole);
      })
    )
  }

  deleteHole(club: Facility, hole: Hole){
    return this.afs.collection('clubs').doc(club.clubId).collection('holes').doc(hole.holeId).delete();
  }

  getCourseList(club: Facility) {
    return new Promise<Course[]>((resolve, reject) => {
      this.afs.collection('clubs').doc(club.clubId).collection<Course>('courses',quer => quer.orderBy('name')).valueChanges().subscribe(snaps => {
        resolve(snaps);
      });
    })
  }

  getCourseInfo(club: Facility, course: string) {
    return new Promise<Course>((resolve, reject) => {
      this.afs.collection('clubs').doc(club.clubId).collection('courses').doc<Course>(course).valueChanges().subscribe(snap => {
        resolve(snap);
      });
    })
  }

  saveCourse(club: Facility, course: Course) {
    let courseObj = Object.assign({}, course);
    return this.afs.collection('clubs').doc(club.clubId).collection('courses').doc(course.courseId).set(courseObj);
  }

  saveNewCourse(club: Facility, course: Course) {
    let courseObj = Object.assign({}, course);
    return new Promise<Course>((resolve, reject) =>
      this.afs.collection('clubs').doc(club.clubId).collection('courses').add(courseObj).then(docRef => {
        course.courseId = docRef.id;
        this.afs.collection('clubs').doc(club.clubId).collection('courses').doc(docRef.id).update({courseId:docRef.id}).then(cours => 
          resolve(course)
        )
      }))
  }

  createCourse(club: Facility) {
    let course = new Course();
    let courseObj = Object.assign({}, course);
    return new Promise<Course>((resolve, reject) =>
      this.afs.collection('clubs').doc(club.clubId).collection<Course>('courses').add(courseObj).then(docRef => {
        course.courseId = docRef.id;
        resolve(course);
      })
    )
  }

  deleteCourse(club: Facility, course: Course){
    return this.afs.collection('clubs').doc(club.clubId).collection('courses').doc(course.courseId).delete();
  }

}
