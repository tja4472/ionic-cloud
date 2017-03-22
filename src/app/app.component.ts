import { Component, ViewChild } from '@angular/core';
import { LoadingController, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { CompletedTodosPage } from '../pages/completed-todos/completed-todos.page';
import { CurrentTodosPage } from '../pages/current-todos/current-todos.page';
import { HomePage } from '../pages/home/home.page';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login.page';
import { SignupPage } from '../pages/signup/signup.page';

import { AuthService } from '../services/auth.service';
import { CompletedTodoService } from '../services/completed-todo.service';
import { CurrentTodoService } from '../services/current-todo.service';

import { ActiveUser } from '../models/active-user';

import { Database } from '@ionic/cloud-angular';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private readonly CLASS_NAME = 'MyApp';

  @ViewChild(Nav) nav: Nav;

  public displayUserName: string;
  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Page One', component: Page1, icon: 'calendar' },
    { title: 'Page Two', component: Page2, icon: 'calendar' },
  ];

  loggedInPages: PageInterface[] = [
    { title: 'Home Page', component: HomePage, icon: 'calendar' },
    { title: 'Current Todos Page', component: CurrentTodosPage, icon: 'calendar' },
    { title: 'Completed Todos Page', component: CompletedTodosPage, icon: 'calendar' },
    { title: 'Logout', component: Page1, icon: 'log-out', logsOut: true }
  ];

  loggedOutPages: PageInterface[] = [
    { title: 'Login', component: LoginPage, icon: 'log-in' },
    { title: 'Signup', component: SignupPage, icon: 'log-in' },
  ];

  currentUser: ActiveUser = null;
  rootPage: any; // = Page1;

  pages: Array<{ title: string, component: any }>;

  constructor(
    private authService: AuthService,
    public db: Database,
    public menu: MenuController,
    public loadingController: LoadingController,
    public platform: Platform,
    private completedTodoService: CompletedTodoService,
    private currentTodoService: CurrentTodoService,
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    this.initializeApp();
  }

  private authServiceSubscription() {
    this.authService.activeUser
      .subscribe(activeUser => {
        console.log(`%s: -- authService.activeUser subscribe --`, this.CLASS_NAME);
        console.log(`%s:activeUser>`, this.CLASS_NAME, activeUser);
        this.currentUser = activeUser;

        if (this.currentUser) {
          console.log(`%s: -- logged in --`, this.CLASS_NAME);
          this.displayUserName = this.currentUser.email;
          this.enableMenu(true);
          this.rootPage = CurrentTodosPage;

          console.log(`%s: -- Initial db.connect()`, this.CLASS_NAME);
          this.db.connect();

        } else {
          console.log(`%s: -- logged out --`, this.CLASS_NAME);
          this.displayUserName = 'Not logged in';
          this.enableMenu(false);
          this.rootPage = LoginPage;
        }
      });
  }

  initializeApp() {
    console.log(`%s:initializeApp`, this.CLASS_NAME);

    this.platform.ready().then(() => {
      console.log(`%s:platform.ready()`, this.CLASS_NAME);
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.authServiceSubscription();

      // check to see if there is already a user... Ionic saves it for you,
      // this will automatically log the user in when you restart the application.
      // This has to be done after platform.ready() else enableMenu() will
      // not change menu.
      this.authService.doCheckAuth();
    });

    const loader = this.loadingController.create({
      content: "Please wait..."
    });

    let loaderShown = false;


    /*
        this.authService.activeUser
          .subscribe(activeUser => {
            console.log(`%s: -- authService.activeUser subscribe --`, this.CLASS_NAME);
            console.log(`%s:activeUser>`, this.CLASS_NAME, activeUser);
            this.currentUser = activeUser;
    
            if (this.currentUser) {
              console.log(`%s: -- logged in --`, this.CLASS_NAME);
              this.displayUserName = this.currentUser.email;
              this.enableMenu(true);
              this.rootPage = CurrentTodosPage;
    
              console.log(`%s: -- Initial db.connect()`, this.CLASS_NAME);
              this.db.connect();
    
            } else {
              console.log(`%s: -- logged out --`, this.CLASS_NAME);
              this.displayUserName = 'Not logged in';
              this.enableMenu(false);
              this.rootPage = LoginPage;
            }
          });
    */
    loader.present().then(() => {
      loaderShown = true;
    });


    this.db.status()
      .subscribe(status => {
        console.log(`%s: -- db.status() subscribe --`, this.CLASS_NAME);
        console.log(`%s:status.type>`, this.CLASS_NAME, status.type);

        //const activeUser = this.authService.activeUser.value;

        if (!this.currentUser) {
          return;
        }

        if (status.type == 'reconnecting' || status.type == 'disconnected') {
          // console.log('MyApp~-- Trying to reconnect DB --');

          /*
          This might not be necessary. Ionic might do retries itself.
                    setTimeout(() => {
                      console.log('MyApp~-- Retry DB connect --');
                      this.db.connect();
                    }, 4000);
          */
        }

        if (status.type === 'connected') {
          // console.log('MyApp~-- connected --')

          this.completedTodoService.load(this.currentUser.id);
          this.currentTodoService.load(this.currentUser.id);

          // this should only be called once.
          if (loaderShown) {
            loader.dismiss().then(() => {
              loaderShown = false;
            });
          }
        }
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // this.nav.setRoot(page.component);
this.rootPage = page.component;

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.authService.doLogout()
      }, 1000);
    }
  }

  enableMenu(loggedIn: boolean): void {
    const loggedInMenu = 'loggedInMenu';
    const loggedOutMenu = 'loggedOutMenu';

    if (!this.menu.get(loggedInMenu)) {
      console.error(`%s:enableMenu() *** WARNING: Menu not found>`, this.CLASS_NAME, loggedInMenu);
    }

    if (!this.menu.get(loggedOutMenu)) {
      console.error(`%s:enableMenu() *** WARNING: Menu not found>`, this.CLASS_NAME, loggedOutMenu);
    }

    this.menu.enable(loggedIn, loggedInMenu);
    this.menu.enable(!loggedIn, loggedOutMenu);
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }


}
