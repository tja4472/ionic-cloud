import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';
// import { TodoService } from '../../services/todo.service';
// import { ItemSelectedOutput, ReorderItemsOutput, TodosInput, TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoCompleted } from '../../models/todo-completed';
import { Validators, FormBuilder } from '@angular/forms';
// import { ControlMessages } from '../../components/control-messages/control-messages.component';

export interface ModalResult {
  isRemoved: boolean;
  isCancelled: boolean;
  todo?: TodoCompleted;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'page-completed-todo-detail',
  templateUrl: 'completed-todo-detail.page.html'
})
export class CompletedTodoDetailPage {
  private readonly CLASS_NAME = 'CompletedTodoDetailPage';

  public todoForm;

  private todo: TodoCompleted =
  {
    id: undefined,
    isComplete: false,
    description: null,
    name: '',
    userId: '',
  };

  /*
  private todo = new TodoCompleted(
    false,
    '',
    '',
  );
  */

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

    this.todoForm = this.formBuilder.group({
      name: [this.todo.name, Validators.required],
      description: [this.todo.description],
      isComplete: [this.todo.isComplete],
    });
  }

  /*
    ionViewDidLoad() {
      //
      this.todoForm = this.formBuilder.group({
        name: [this.todo.name, Validators.required],
        description: [this.todo.description],
        isComplete: [this.todo.isComplete]
      });
    }
  */

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
    console.log('this.todo>', this.todo);
    /*
        // Get error here with private todo when using popover.
        // Hence local.
        let localTodo: TodoCompleted = Object.assign(this.todo);
        localTodo.description = this.todoForm.value.description;
        localTodo.isComplete = this.todoForm.value.isComplete;
        localTodo.name = this.todoForm.value.name;
        console.log('localTodo>', localTodo);
    
        let modalResult: ModalResult = {
          isRemoved: false,
          isCancelled: false,
          todo: localTodo,
        };
    */
    // No longer seems an issue.
    this.todo.description = this.todoForm.value.description;
    this.todo.isComplete = this.todoForm.value.isComplete;
    this.todo.name = this.todoForm.value.name;
    console.log('localTodo>', this.todo);

    let modalResult: ModalResult = {
      isRemoved: false,
      isCancelled: false,
      todo: this.todo,
    };

    this.viewController.dismiss(modalResult);
  }
}
