import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { NavController } from 'ionic-angular';
import { SignupPage } from '../signup/signup.page';

import { AuthService } from '../../services/auth.service'


@Component({
  selector: 'page-login',  
  templateUrl: 'login.page.html'
})
export class LoginPage {
  private readonly CLASS_NAME = 'LoginPage';

  public submitted = false;
  public loginForm: FormGroup;

  loginState$: any;

  constructor(
    private formBuilder: FormBuilder,
    private nav: NavController,
    private authService: AuthService,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    /*
        // http://blog.angular-university.io/introduction-to-angular-2-forms-template-driven-vs-model-driven/
        this.loginForm.valueChanges
          .map((value) => {
            console.log("loginForm value>", value)
            return value;
          })
          .filter((value) => this.loginForm.valid)
          .subscribe(valid => console.log("loginForm value updates to", valid));
    */
  }

  onLogin() {
    this.submitted = true;
    console.log('this.loginForm.value>', this.loginForm.value);

    if (this.loginForm.dirty && this.loginForm.valid) {
      this.authService.doLogin(this.loginForm.value.username, this.loginForm.value.password);
    }
  }

  onSignup() {
    console.log('onSignup');
    this.nav.push(SignupPage);
  }

  signInAnonymously() {
    console.log('signInAnonymously');
    // this.store.dispatch(
    //   new loginActions.AnonymousAuthenticationAction());
  }

  signInWithGoogle() {
    console.log('signInWithGoogle');

    // this.store.dispatch(
    //   new loginActions.GoogleAuthenticationAction());
  }

  ionViewDidLeave() {
    console.log('LoginPage:ionViewDidLeave');    
  }  
}
