import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  firebaseError: string;

  constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) {
    this.loginForm = new FormBuilder().group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.firebaseError = '';
  }

  login() {
    if(this.loginForm?.invalid) return;

    this.authService.loginUser(this.loginForm?.value.email, this.loginForm?.value.password)
      .then((res: any) => {
        if(res == null){
          console.log('Logging in');
          this.router.navigate(['/management'])
        }else if(res == false){
          console.log('Login error');
          this.firebaseError = res.message;
        }
      }).catch((error) => {
        this.firebaseError = error.message;
      })
  }
}
