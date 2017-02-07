import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable';

import { Database } from '@ionic/cloud-angular';
import { reorderArray } from 'ionic-angular';

import { AuthService } from '../services/auth.service';
import { Todo } from '../models/todo';

// const FIREBASE_CURRENT_TODOS = '/todo/currentTodos';

// Multiple subscriptions on a FirebaseListObservable #574
// https://github.com/angular/angularfire2/issues/574
// beta.7 

// https://coryrylan.com/blog/angular-2-observable-data-services

// https://dzone.com/articles/how-to-build-angular-2-apps-using-observable-data-1

@Injectable()
export class TodoService {
    private _todos: BehaviorSubject<Todo[]>;
    private dataStore: {  // This is where we will store our data in memory
        todos: Todo[]
    };

    constructor(
        public db: Database,
        private authService: AuthService,
    ) {
        console.log('TodoService:constructor');
        this.db.connect();
        this.dataStore = { todos: [] };
        this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
        this.db.collection('todos')
            .order("index", "ascending")
            .watch()
            .do(x => console.log('TodoService:watch>', x))
            // replace this with one function.
            //.map(x => x.map(d => fromFirebaseTodo(d)))
            .map(x => fromDatabase(x))
            .subscribe(
            result3 => {
                console.log('TodosPage:result3>', result3);
                this.dataStore.todos = result3;
                this._todos.next(Object.assign({}, this.dataStore).todos);
            },
            err => { console.error(err); }
            );

    }

    // =======
    get todos() {
        return this._todos.asObservable();
    }
    /*
        private loadAll() {
            this.db.collection('todos')
                .watch()
                // replace this with one function.
                .map(x => x.map(d => fromFirebaseTodo(d)))
                .subscribe(
                result3 => {
                    console.log('TodosPage:result3>', result3);
                    this.dataStore.todos = result3;
                    this._todos.next(Object.assign({}, this.dataStore).todos);
                },
                err => { console.error(err); }
                );
        }
    */

    // =======

    //            reorderItemsAndUpdate(indexes: Indexes, todos: Todo[]) {
    reorderItems(indexes: any) {
        const itemsToSave = [...this.dataStore.todos];
        reorderArray(itemsToSave, indexes);

        let updates: any[] = [];
        for (let x = 0; x < itemsToSave.length; x++) {
            updates.push({ id: itemsToSave[x].id, index: x });
        }

        this.db.collection('todos').update(updates);
    }

    removeItem(todo: Todo) {
        console.log('removeItem>', todo);
        this.db.collection('todos').remove(todo.id);
    }

    saveItem(todo: Todo) {
        console.log('save>', todo);
        let userId = this.authService.activeUser.value.id;
        todo.userId = userId;
        this.db.collection('todos').store(toFirebaseTodo(todo));

        /*
                if (todo.$key === '') {
                    // insert.
                    this.fb_CurrentTodos$.push(toFirebaseTodo(todo));
                } else {
                    // update.
                    this.fb_CurrentTodos$.update(todo.$key, toFirebaseTodo(todo));
                }
        */
    }

    //toggleCompleteItem

    private dummyData(): Observable<Todo[]> {
        let data: Todo[] =
            [{
                id: 'AA',
                description: 'AA-description',
                name: 'AA-name',
                index: 0,
                isComplete: false,
                userId: 'a01',
            },
            {
                id: 'BB',
                description: 'BB-description',
                name: 'BB-name',
                index: 0,
                isComplete: false,
                userId: 'a01',
            },
            {
                id: 'CC',
                description: 'CC-description',
                name: 'CC-name',
                index: 0,
                isComplete: false,
                userId: 'a01',
            }];

        return Observable.of(data);
    }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!
// To insert need to remove id PropertyKey.
//
interface FirebaseTodo {
    id: string;
    description?: string;
    index: number;
    name: string;
    isComplete: boolean;
    userId: string;
}

function toFirebaseTodo(todo: Todo): FirebaseTodo {
    //
    let result: FirebaseTodo = {
        id: todo.id,
        //id: undefined,
        description: todo.description,
        index: todo.index,
        name: todo.name,
        isComplete: todo.isComplete,
        userId: todo.userId,
    };

    console.log('toFirebaseTodo>', result);
    return result;
}

function fromDatabase(x: any[]): Todo[] {
    console.log('fromFirebaseTodo');

    let result = x.map(d => fromFirebaseTodo(d));

    return result;
}

function fromFirebaseTodo(x: any): Todo {
    console.log('fromFirebaseTodo');

    let result: Todo = {
        id: x.id,
        description: x.description,
        index: x.index,
        isComplete: x.isComplete,
        name: x.name,
        userId: x.userId,
    };

    if (result.description === undefined) {
        result.description = null;
    }

    if (result.isComplete === undefined) {
        result.isComplete = false;
    }

    return result;
}