import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'eb9cf950'
  },
  'database': {
    'authType': 'authenticated'
  }  
};

import { CurrentTodosPage } from '../pages/current-todos/current-todos.page';
import { HomePage } from '../pages/home/home.page';

import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

import { LoginPage } from '../pages/login/login.page';
import { SignupPage } from '../pages/signup/signup.page';
import { TodoModalPage } from '../pages/todo-modal/todo-modal.page';

import { TodoListComponent } from '../components/todo-list/todo-list.component';

// import { MyFirebaseAppConfig } from './my-firebase-app-config';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

import { AuthService } from '../services/auth.service';
import { TodoService } from '../services/todo.service';

@NgModule({
  declarations: [
    CurrentTodosPage,    
    HomePage,
    MyApp,
    Page1,
    Page2,
    LoginPage,
SignupPage,    
    TodoListComponent,
    TodoModalPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CurrentTodosPage,    
    HomePage,
    MyApp,
    LoginPage,
SignupPage,    
    Page1,
    Page2,
    TodoModalPage,
  ],
  providers: [
    AuthService,
    TodoService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
