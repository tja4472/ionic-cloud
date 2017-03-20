import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Observable } from 'rxjs/Observable';

import { Database } from '@ionic/cloud-angular';
import { reorderArray } from 'ionic-angular';

import { AuthService } from '../services/auth.service';
import { CompletedTodoService } from '../services/completed-todo.service';

import { Todo } from '../models/todo';
import { TodoCompleted } from '../models/todo-completed';
// const FIREBASE_CURRENT_TODOS = '/todo/currentTodos';

// Multiple subscriptions on a FirebaseListObservable #574
// https://github.com/angular/angularfire2/issues/574
// beta.7 

// https://coryrylan.com/blog/angular-2-observable-data-services

// https://dzone.com/articles/how-to-build-angular-2-apps-using-observable-data-1

@Injectable()
export class CurrentTodoService {
    private readonly CLASS_NAME = 'CurrentTodoService';

    private _todos: BehaviorSubject<Todo[]>;
    private dataStore: {  // This is where we will store our data in memory
        todos: Todo[]
    };

    private readonly collectionName = 'current_todos';
    /*
    Currently this is a singleton for the app.
    So constructor gets called once.
    
    Database needs to be requeried when login status changes.
    */
    constructor(
        public db: Database,
        private authService: AuthService,
        private completedTodoService: CompletedTodoService,
    ) {
        console.log(`%s:constructor`, this.CLASS_NAME);
        this.dataStore = { todos: [] };
        this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
        /*        
                this.db.status().subscribe((status) => {
                    console.log('db.status:status.type>', status.type);
                });
        */
        // this.db.connect();
        /*
                this.authService.activeUser.subscribe((_user) => {
                    console.log('TodoService:activeUser.subscribe>', _user);
                    let filterUserId: string = '';
                    if (_user) {
                        filterUserId = _user.id;
                    }
                    console.log('userId>', filterUserId);
        
                    let aaa = _user ? _user.id : 'null!!';
                    console.log('aaa>', aaa);
        
                    this.dataStore = { todos: [] };
                    this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
                    this.db.collection('todos')
                        .order("index", "ascending")
                        .findAll({ userId: filterUserId })
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
        
        
        
                });
        */
        /*
                //need to filter by activeuser.
                let user = this.authService.activeUser.getValue();
                let userIdAAAA: string = '';
        
                if (user) {
                    userIdAAAA = user.id;
                }
                console.log('userId>', userIdAAAA);
        
        */
        // console.log('this.authService.activeUser.value.id>', this.authService.activeUser.value.id);

        /*
                this.dataStore = { todos: [] };
                this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
                this.db.collection('todos')
                    .order("index", "ascending")
                    .findAll({userId: userIdAAAA})
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
        */
    }

    public clearCompletedItems(): void {
        let completedItems = this.dataStore.todos.filter(a => a.isComplete);
        console.log('TodoService:clearCompletedItems>', completedItems);

        completedItems.map(x => {
            console.log('x>', x);
            /*
                private todo: TodoCompleted =
                {
                  id: undefined,
                  isComplete: false,
                  description: null,
                  name: '',
                  userId: '',
                };
            */

            let todoCompleted: TodoCompleted =
                {
                    id: undefined,
                    isComplete: x.isComplete,
                    description: x.description,
                    name: x.name,
                    userId: x.userId,
                };
            /*    
                        let todoCompleted = new TodoCompleted(
                            x.isComplete,
                            x.userId,
                            x.name,
                            x.description,
                        );
            */

            this.completedTodoService.saveItem(todoCompleted);
            this.removeItem(x);
        });
    }

    public moveToCurrent(item: TodoCompleted): void {
        console.log('moveToCurrent>', item);
        let todo: Todo = {
            id: undefined,
            description: item.description,
            name: item.name,
            isComplete: item.isComplete,
            index: 0,
            userId: item.userId,
        };

        this.saveItem(todo);
        this.completedTodoService.removeItem(item);
    }

    // =======
    get todos() {
        return this._todos.asObservable();
    }

    public reset(): void {
        console.log('CurrentTodoService#reset');
        this.dataStore = { todos: [] };
        this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
    }

    public load(
        activeUserId: string,
    ): void {
        console.log('TodoService:load:activeUserId>', activeUserId);


        // this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
        this.db.collection(this.collectionName)
            .order("index", "ascending")
            .findAll({ userId: activeUserId })
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

        this.db.collection(this.collectionName).update(updates);
    }

    removeItem(todo: Todo) {
        console.log('removeItem>', todo);
        this.db.collection(this.collectionName).remove(todo.id);
    }

    saveItem(todo: Todo) {
        console.log('save>', todo);
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

    public toggleCompleteItem(todo: Todo): void {
        todo.isComplete = !todo.isComplete;
        this.saveItem(todo);
    }

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