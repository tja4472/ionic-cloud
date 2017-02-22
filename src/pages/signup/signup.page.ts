import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { NavController } from 'ionic-angular';
// import { SignupPage } from '../signup/signup.page';

import { AuthService } from '../../services/auth.service'


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'signup.page.html'
})
export class SignupPage {
  submitted = false;
  public signupForm: FormGroup; 

  loginState$: any;

  constructor(
    private formBuilder: FormBuilder,
    private nav: NavController,
    private authService: AuthService,
    ) {
    //
    console.log('SignupPage');
     this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });   
  }

  onLogin(form: FormGroup) {
    this.submitted = true;

    if (form.valid) {
              console.log('EmailAuthenticationAction>', form.value.username);
              this.authService.doLogin(form.value.username, form.value.password);
/*        
      this.store.dispatch(
        this.loginActions.emailAuthentication(
          this.login.username,
          this.login.password));
*/          
    }
  }


  onSignup(form: FormGroup) {
      console.log('onSignup');
    this.submitted = true;
    if (form.valid) {
              console.log('EmailAuthenticationAction>', form.value.username);
              this.authService.doSignup(form.value.username, form.value.password);
    }
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
}
