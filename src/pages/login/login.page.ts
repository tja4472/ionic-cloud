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

  // loginState$: any;

  constructor(
    private formBuilder: FormBuilder,
    private nav: NavController,
    private authService: AuthService,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.createForm();
  }

  private createForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin() {
    this.submitted = true;
    console.log('this.loginForm.value>', this.loginForm.value);
    const formModel = this.loginForm.value;

    if (this.loginForm.dirty && this.loginForm.valid) {
      this.authService.doLogin(formModel.username, formModel.password);
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
