import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';
// import { TodoService } from '../../services/todo.service';
// import { ItemSelectedOutput, ReorderItemsOutput, TodosInput, TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoCompleted } from '../../models/todo-completed';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
// import { ControlMessages } from '../../components/control-messages/control-messages.component';

export interface ModalResult {
  isRemoved: boolean;
  isCancelled: boolean;
  todo?: TodoCompleted;
}

@Component({
  selector: 'page-completed-todo-detail',
  templateUrl: 'completed-todo-detail.page.html'
})
export class CompletedTodoDetailPage {
  private readonly CLASS_NAME = 'CompletedTodoDetailPage';

  public todoForm: FormGroup;

  // data model.
  private todo: TodoCompleted =
  {
    id: undefined,
    isComplete: false,
    description: null,
    name: '',
    userId: '',
  };

  private isEditing: boolean;

  constructor(
    private formBuilder: FormBuilder,
    params: NavParams,
    public viewController: ViewController
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
    console.log('params:get>', params.get('todo'));

    let paramTodo: TodoCompleted = params.get('todo');
    this.isEditing = !!paramTodo;

    if (this.isEditing) {
      this.todo = paramTodo;
    }

    this.createForm();
  }

  private createForm(): void {
    this.todoForm = this.formBuilder.group({
      name: [this.todo.name, Validators.required],
      description: [this.todo.description],
      isComplete: [this.todo.isComplete],
    });
  }

  dismiss() {
    console.log('dismiss');
    let modalResult: ModalResult = {
      isRemoved: false,
      isCancelled: true,
    };
    this.viewController.dismiss(modalResult);
  }

  remove() {
    console.log('remove');
    let modalResult: ModalResult = {
      isRemoved: true,
      isCancelled: false,
      todo: this.todo,
    };
    this.viewController.dismiss(modalResult);
  }

  save() {
    console.log('save');

    if (!this.todoForm.valid) {
      return;
    }

    console.log('this.todoForm.value>', this.todoForm.value);
    console.log('this.todoForm.status>', this.todoForm.status);

    this.todo = this.prepareSaveData();
    // console.log('localTodo>', this.todo);

    let modalResult: ModalResult = {
      isRemoved: false,
      isCancelled: false,
      todo: this.todo,
    };

    this.viewController.dismiss(modalResult);
  }

  private prepareSaveData(): TodoCompleted {
    const formModel = this.todoForm.value;

    const saveData: TodoCompleted = {
      description: formModel.description,
      id: this.todo.id,
      isComplete: formModel.isComplete,
      name: formModel.name,
      userId: this.todo.userId,
    };

    return saveData;
  }
}
