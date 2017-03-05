import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

// import { NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service'


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'signup.page.html'
})
export class SignupPage {
  public submitted = false;
  public signupForm: FormGroup;

  loginState$: any;

  constructor(
    private formBuilder: FormBuilder,
    // private nav: NavController,
    private authService: AuthService,
  ) {
    //
    console.log('SignupPage');
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSignup() {
    console.log('onSignup:this.signupForm.value>', this.signupForm.value);
    this.submitted = true;

    if (this.signupForm.valid) {
      this.authService.doSignup(this.signupForm.value.username, this.signupForm.value.password);
    }
  }
}
