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
import { CurrentTodoDetailPage } from '../pages/current-todo-detail/current-todo-detail.page';
import { CurrentTodosPage } from '../pages/current-todos/current-todos.page';
import { HomePage } from '../pages/home/home.page';

import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

import { LoginPage } from '../pages/login/login.page';
import { SignupPage } from '../pages/signup/signup.page';


import { CurrentTodoListComponent } from '../components/current-todo-list/current-todo-list.component';

// import { MyFirebaseAppConfig } from './my-firebase-app-config';

// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

import { AuthService } from '../services/auth.service';
import { TodoService } from '../services/todo.service';

@NgModule({
  declarations: [
    CurrentTodoDetailPage,
    CurrentTodoListComponent,
    CurrentTodosPage,
    HomePage,
    MyApp,
    Page1,
    Page2,
    LoginPage,
    SignupPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CurrentTodoDetailPage,
    CurrentTodosPage,
    HomePage,
    MyApp,
    LoginPage,
    SignupPage,
    Page1,
    Page2,
  ],
  providers: [
    AuthService,
    TodoService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule { }
