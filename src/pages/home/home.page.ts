import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private authService: AuthService) {

  }


  doLogout() {
    this.authService.doLogout()
  }
}
