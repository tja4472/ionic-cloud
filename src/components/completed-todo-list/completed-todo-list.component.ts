import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoCompleted } from '../../models/todo-completed';

@Component({
  selector: 'completed-todo-list',
  templateUrl: 'completed-todo-list.component.html',
})
export class CompletedTodoListComponent {
  private readonly CLASS_NAME = 'CompletedTodoListComponent';

  @Input() public data: TodoCompleted[];

  @Output() public editItem = new EventEmitter<TodoCompleted>();
  @Output() public toggleCompleteItem = new EventEmitter<TodoCompleted>();

  constructor(
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
  }
}
