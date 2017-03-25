import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Todo } from '../../models/todo';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'page-current-todo-detail',
    templateUrl: 'current-todo-detail.page.html',
})
export class CurrentTodoDetailPage {
    private readonly CLASS_NAME = 'CurrentTodoDetailPage';

    public todoForm: FormGroup;

    // data model.
    private formResult: Todo =
    {
        id: undefined,
        description: null,
        name: '',
        index: 0,
        isComplete: false,
        userId: undefined,
    };

    private isEditing: boolean;

    constructor(
        public formBuilder: FormBuilder,
        params: NavParams,
        public viewController: ViewController
    ) {
        console.log(`%s:constructor`, this.CLASS_NAME);
        console.log('params:get>', params.get('todo'));

        let paramTodo: Todo = params.get('todo');
        this.isEditing = !!paramTodo;

        if (this.isEditing) {
            this.formResult = paramTodo;
        }

        this.createForm();
    }

    private createForm(): void {
        this.todoForm = this.formBuilder.group({
            nameA: [this.formResult.name, Validators.required],
            description: [this.formResult.description],
            isComplete: [this.formResult.isComplete]
        });
    }

    dismiss() {
        console.log('dismiss');
        this.viewController.dismiss();
    }

    save() {
        console.log('TodoModalPage:save');
        console.log('TodoModalPage:todoForm>', this.todoForm);

        if (!this.todoForm.valid) {
            return;
        }
        /*
            if (this.userForm.dirty && this.userForm.valid) {
              alert(`Name: ${this.userForm.value.name} Email: ${this.userForm.value.email}`);
            }
        */

        // if(this.todoForm.touched)
        console.log(this.todoForm.value);
        console.log('this.formResult>', this.formResult);
        // this.formResult.description = this.todoForm.value.description;
        // this.formResult.isComplete = this.todoForm.value.isComplete;
        // this.formResult.name = this.todoForm.value.nameA;
        this.formResult = this.prepareSaveData();
        
        this.viewController.dismiss(this.formResult);
    }

   private prepareSaveData(): Todo {
    const formModel = this.todoForm.value;

    const saveData: Todo = {
      description: formModel.description,
      id: this.formResult.id,
      index: this.formResult.index,
      isComplete: formModel.isComplete,
      name: formModel.nameA,
      userId: this.formResult.userId,
    };

    return saveData;
  }   
}
