import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home.page';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login.page';
import { TodosPage } from '../pages/todos/todos.page';

import { AuthService } from '../services/auth.service';

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
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Page One', component: Page1, icon: 'calendar' },
    { title: 'Page Two', component: Page2, icon: 'calendar' },
    { title: 'Todos Page', component: TodosPage, icon: 'calendar' },
    { title: 'Home Page', component: HomePage, icon: 'calendar' },
    { title: 'Login', component: LoginPage, icon: 'calendar' },
  ];

  loggedInPages: PageInterface[] = [
  ];

  loggedOutPages: PageInterface[] = [
  ];

  currentUser;
  rootPage: any; // = Page1;

  pages: Array<{ title: string, component: any }>;

  constructor(
    private authService: AuthService,
    public platform: Platform,
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 },
      { title: 'Todos Page', component: TodosPage },
      { title: 'Home Page', component: HomePage },
      { title: 'Login', component: LoginPage },
      // { title: 'Logout', component: LandingPage },        
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    // subscribe to the activeUser to see if we should go to the LoginPage
    // or directly to the HomePage since we have a user
    this.authService.activeUser.subscribe((_user) => {

      // get the user...
      this.currentUser = _user

      // if user.. show data, else show login
      if (this.currentUser) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    })

    // check to see if there is already a user... Ionic saves it for you,
    // this will automatically log the user in when you restart the application
    this.authService.doCheckAuth();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
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
