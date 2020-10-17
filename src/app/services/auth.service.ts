import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  signUp(credentials) {
    return this.afAuth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(data => {
      console.log('after register, data: ', data);
      return this.db.doc(`users/${data.user.uid}`).set({
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  }


}
