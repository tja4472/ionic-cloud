import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

export interface MyPopoverPageResult {
  clearCompleted: boolean;
}

@Component({
  template: `
    <ion-list>
    <!--
      <ion-list-header>Ionic</ion-list-header>
-->      
      <button ion-item (click)="clearCompleted()">Clear completed</button>
    </ion-list>
  `
})
export class MyPopoverPage {
    private readonly CLASS_NAME = 'MyPopoverPage';

  constructor(
    public viewCtrl: ViewController
    ) {
      console.log(`%s:constructor`, this.CLASS_NAME);    
    }

  clearCompleted() {
    let result: MyPopoverPageResult = {
      clearCompleted: true,
    }

    this.viewCtrl.dismiss(result);
  }

  close(data: string) {
    this.viewCtrl.dismiss(data);
  }
}
