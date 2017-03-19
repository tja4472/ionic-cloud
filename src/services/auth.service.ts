import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/map';

import { Auth, Database, User, IDetailedError } from '@ionic/cloud-angular';

import { ActiveUser } from '../models/active-user';

// Original: https://github.com/aaronksaunders/Ionic2-Ionic.io-Auth-Example

@Injectable()
export class AuthService {
    //
    // this will hold the user object when we have one, we can subscribe
    // to changes of this object to determine of we are logged in or not
    activeUser = new BehaviorSubject<ActiveUser>(null)

    constructor(
        private auth: Auth,
        public db: Database,
        private user: User) {
    }

    /**
     * here we check to see if ionic saved a user for us
     */
    doCheckAuth() {
        console.log('AuthService~doCheckAuth()');
        if (this.auth.isAuthenticated()) {
            // this.db.connect();
            /*
            let authUser = new ActiveUser(
                this.user.id,
                this.user.details.email,
                this.user.details.image,
                this.user.details.username,
                this.user.details.name,
            );
            */

            let authUser: ActiveUser = {
                id: this.user.id,
                email: this.user.details.email,
                image: this.user.details.image,
                name: this.user.details.name,
                userName: this.user.details.username
            };

            // this.activeUser.next(Object.assign({}, this.user.details, { id: this.user.id }))
            this.activeUser.next(authUser);
        }
    }

    /**
     * login using a username and password
     */
    doLogin(_username, _password?) {
        if (_username.length) {

            let details = { 'email': _username, 'password': _password };

            this.auth.login('basic', details).then((_result) => {
                let aa = Object.assign({}, this.user.details, { id: this.user.id });
                console.log('aa>', aa)
                // this.db.connect();
                /*
                "{
                    "image":"https://s3.amazonaws.com/ionic-api-auth/users-default-avatar@2x.png",
                    "name":null,
                    "username":"aa",
                    "email":"a.a@a.com",
                    "id":"99886d83-ecc4-47aa-913e-de9a2fb8671f"
                }"                
                */
                // create the user object based on the data retrieved...
                /*
                let authUser = new ActiveUser(
                    this.user.id,
                    this.user.details.email,
                    this.user.details.image,
                    this.user.details.username,
                    this.user.details.name,
                );
                */

                let authUser: ActiveUser = {
                    id: this.user.id,
                    email: this.user.details.email,
                    image: this.user.details.image,
                    name: this.user.details.name,
                    userName: this.user.details.username
                };

                this.activeUser.next(authUser);
                // this.activeUser.next(Object.assign({}, this.user.details, { id: this.user.id }))
            }, (err) => {
                // Gives POST https://api.ionic.io/auth/login 401 ()
                // Error: Unsuccessful HTTP response
                console.log('AAAAA>', err)
            });
        }
    }

    /**
     * create the user with the information and set the user object
     */
    doCreateUser(_params) {
        this.auth.signup({ email: _params.email, password: _params.password, username: _params.username })
            .then(() => {
                return this.doLogin(_params.email, _params.password);
            }, (err: IDetailedError<string[]>) => {
                console.log(err)
                for (let e of err.details) {
                    if (e === 'conflict_email') {
                        alert('Email already exists.');
                    } else {
                        // handle other errors
                    }
                }
            });
    }

    doSignup(_email, _password?) {
        if (_email.length) {
            let details = { 'email': _email, 'password': _password };

            this.auth.signup(details)
                .then(() => {
                    return this.doLogin(_email, _password);
                }, (err: IDetailedError<string[]>) => {
                    console.log(err)
                    for (let e of err.details) {
                        if (e === 'conflict_email') {
                            alert('Email already exists.');
                        } else {
                            // handle other errors
                        }
                    }
                });
        }
    }

    /**
     * logout and remove the user...
     */
    doLogout() {
        this.auth.logout();
        this.activeUser.next(null)
    }
}


/*
import { AngularFireAuth , FirebaseAuthState } from 'angularfire2';

@Injectable()
export class AuthService {
    private authState: FirebaseAuthState = null;

    constructor(   
        public auth$: AngularFireAuth 
    ) {
        console.log('AuthService');

        this.auth$.subscribe((state: FirebaseAuthState) => {
            console.log('AuthService:state', state);
            this.authState = state;
        });
    }

    get authenticated(): boolean {
        return this.authState !== null;
    }

    signOut(): void {
        this.auth$.logout();
    }
    =/*
        get authState(): FirebaseAuthState {
            return this.authState;
        }
    =/
}
*/
