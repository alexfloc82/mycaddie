import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { User } from './datamodel';

import { Observable } from 'rxjs/Observable';

import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {
  userProfile: Observable<User>;
  user: Observable<firebase.User>;
  usersCol: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  authState: any = null;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router, ) {
    this.user = firebaseAuth.authState;
    this.user.subscribe(auth => this.authState = auth);
    this.userProfile = new Observable(observer => observer.next(new User()));
    this.getProfile();
    this.usersCol = afs.collection('users');
    this.users = this.usersCol.valueChanges();
  }

  signup(user: User) {

    return new Promise<User>((resolve, reject) => this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(value => {
        delete user.password;
        delete user.confirm;
        let newUser = Object.assign({}, user);
        this.afs.collection('users').doc(value.uid).set(newUser).then(a => {
          this.getProfile();
          resolve(user);
        })
      })
      .catch(err => reject(err)));
  }

  loginWithGoogle(scope?:string) {
    const provider = new firebase.auth.GoogleAuthProvider();
    if(scope){
      provider.addScope(scope);
    }
    
    return new Promise((resolve, reject) =>
      this.firebaseAuth.auth.signInWithPopup(provider)
        .then((credential) => {

          if(credential.additionalUserInfo.isNewUser)
          {
            let profile = credential.additionalUserInfo.profile;
            let user= new User;
            user.uid = credential.user.uid;
            user.fullname = profile.name;
            user.email = profile.email;
            user.locale = profile.locale;
            user.gender = profile.gender;
            user.lastname = profile.family_name;
            user.name = profile.given_name;
            user.picture = profile.picture;
            let newUser = Object.assign({}, user);
            this.afs.collection('users').doc(user.uid).set(newUser).then(a => {
              this.getProfile();
              resolve(firebase.auth().currentUser.uid);
              //firebase.auth().currentUser.getIdToken().then(idToken => resolve(idToken));
            })

          }
          else{
            this.getProfile();
            resolve(firebase.auth().currentUser.uid);
            //firebase.auth().currentUser.getIdToken().then(idToken => resolve(idToken));
          }
        }
        )
        .catch(error => console.log(error))
    )
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(a => {
        this.getProfile();
        resolve(a)
      }
      )
      .catch(err =>
        reject(err)
      ))
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut()
      .then(a => this.router.navigate(['/user/login']));
  }

  getProfile() {

    this.user.subscribe(userAuth => {
      let doc: AngularFirestoreDocument<User>;
      doc = this.afs.doc('users/' + userAuth.uid);
      doc.valueChanges().subscribe(userProfile => {
        this.userProfile = new Observable(observer => observer.next(userProfile));
      });
    });
  }

  sendResetPassword(email: string) {
    this.firebaseAuth.auth.sendPasswordResetEmail(email)
      .then(a => console.log('Un email a sido enviado a ' + email + ' para resetear su contraseña.', 'info'))
      .catch(err =>
        console.log(err.message)
      );
  }

  resetPass(newPass: string, code?: string) {
    return new Promise((resolve, reject) => {
      if (code) {
        this.firebaseAuth.auth.confirmPasswordReset(code, newPass)
          .then(a => {
            console.log('Su contraseña ha sido reseteada correctamente', 'info');
            resolve(a);
          })
          .catch(err => {
            console.log(err.message);
            reject(err)
          }
          );

      }
      else {
        this.firebaseAuth.auth.currentUser.updatePassword(newPass)
          .then(a => {
            console.log('Su contraseña ha sido actualizada', 'info');
            resolve(a);
          })
          .catch(err => {
            console.log(err.message);
            reject(err)
          }
          );
      }
    }
    )

  }

  getEmail(code: string) {
    this.firebaseAuth.auth.verifyPasswordResetCode(code)
      .then(a => {
        console.log('Su contraseña ha sido actualizada', 'info');
      })
      .catch(err => {
        console.log(err.message);
      }
      );
  }

  canActivate(): boolean {
    if(environment.production){
      if (this.authState == null) {
        this.router.navigate(['user/login']);
      }
      return true;
    }
    else{
      return true
    }

  }

}