import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userLoggedIn: boolean = false;

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.userLoggedIn = false;
    this.afAuth.onAuthStateChanged((user) => { // This is a listener that will be called when the user logs in or out
      if (user) { // If the user is logged in
        this.userLoggedIn = true; // Set the userLoggedIn variable to true
      } else { // If the user is not logged in
        this.userLoggedIn = false; // Set the userLoggedIn variable to false
      }
    }
    )
  }

  loginUser(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password) // signInWithEmailAndPassword returns a promise
      .then((res) => { // If the user is logged in
        this.userLoggedIn = true; // Set the userLoggedIn variable to true
        return { isValid: true};
      }).catch((error) => { // If the user is not logged in
        this.userLoggedIn = false; // Set the userLoggedIn variable to false
        return { isValid: false, errorMessage: error.message };
      })
  }
}
