import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {
  private readonly CLASS_NAME = 'Page1';
  
  constructor(
    public navCtrl: NavController
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
  }
}
