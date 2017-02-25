import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
// import { Observable } from 'rxjs/Observable';

import { Database } from '@ionic/cloud-angular';
import { reorderArray } from 'ionic-angular';

import { AuthService } from '../services/auth.service';
import { TodoCompleted } from '../models/todo-completed';

// const FIREBASE_CURRENT_TODOS = '/todo/currentTodos';

// Multiple subscriptions on a FirebaseListObservable #574
// https://github.com/angular/angularfire2/issues/574
// beta.7 

// https://coryrylan.com/blog/angular-2-observable-data-services

// https://dzone.com/articles/how-to-build-angular-2-apps-using-observable-data-1

@Injectable()
export class CompletedTodoService {
    private _todos: BehaviorSubject<TodoCompleted[]>;
    private dataStore: {  // This is where we will store our data in memory
        todos: TodoCompleted[]
    };

    private readonly collectionName = 'completed_todos';
    /*
    Currently this is a singleton for the app.
    So constructor gets called once.
    
    Database needs to be requeried when login status changes.
    */
    constructor(
        public db: Database,
        private authService: AuthService,
    ) {
        console.log('CompletedTodoService:constructor');
    }

    // =======
    get todos() {
        return this._todos.asObservable();
    }

    public reset(): void {
        this.dataStore = { todos: [] };
    }

    public load(
        activeUserId: string,
    ): void {
        console.log('CompletedTodoService:load:activeUserId>', activeUserId);

        this._todos = <BehaviorSubject<TodoCompleted[]>>new BehaviorSubject([]);
        this.db.collection(this.collectionName)
            .findAll({ userId: activeUserId })
            .watch()
            .do(x => console.log('CompletedTodoService:watch>', x))
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

    reorderItems(indexes: any) {
        const itemsToSave = [...this.dataStore.todos];
        reorderArray(itemsToSave, indexes);

        let updates: any[] = [];
        for (let x = 0; x < itemsToSave.length; x++) {
            updates.push({ id: itemsToSave[x].id, index: x });
        }

        this.db.collection(this.collectionName).update(updates);
    }

    removeItem(todo: TodoCompleted) {
        console.log('removeItem>', todo);
        this.db.collection(this.collectionName).remove(todo.id);
    }

    saveItem(todo: TodoCompleted) {
        console.log('saveItem>', todo);
        let userId = this.authService.activeUser.value.id;
        todo.userId = userId;
        this.db.collection(this.collectionName).store(toFirebaseTodo(todo));

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

    public toggleCompleteItem(todo: TodoCompleted): void {
        todo.isComplete = !todo.isComplete;
        this.saveItem(todo);
    }
/*
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
*/    
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!
// To insert need to remove id PropertyKey.
//
interface FirebaseTodo {
    id: string;
    description?: string;
    name: string;
    isComplete: boolean;
    userId: string;
}

function toFirebaseTodo(todo: TodoCompleted): FirebaseTodo {
    //
    let result: FirebaseTodo = {
        id: todo.id,
        //id: undefined,
        description: todo.description,
        name: todo.name,
        isComplete: todo.isComplete,
        userId: todo.userId,
    };

    console.log('toFirebaseTodo>', result);
    return result;
}

function fromDatabase(x: any[]): TodoCompleted[] {
    console.log('fromFirebaseTodo');

    let result = x.map(d => fromFirebaseTodo(d));

    return result;
}

function fromFirebaseTodo(x: any): TodoCompleted {
    console.log('fromFirebaseTodo');

    let result: TodoCompleted = {
        id: x.id,
        description: x.description,
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