import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => { // This is a listener that will be called when the user logs in or out
        if (user) { // If the user is logged in
          resolve(true); // Allow the user to access the route
        } else { // If the user is not logged in
          this.router.navigate(['/login']); // Redirect the user to the login page
          resolve(false); // Do not allow the user to access the route
        }
      })
    });
  }

}
