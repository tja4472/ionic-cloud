import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthService } from '../../services/auth.service'


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.page.html'
})
export class SignupPage {
  private readonly CLASS_NAME = 'SignupPage';

  public submitted = false;
  public signupForm: FormGroup;

  loginState$: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
