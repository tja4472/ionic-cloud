import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ReorderArrayIndexes } from '../../models/reorder-array-indexes';
import { Todo } from '../../models/todo';

@Component({
  selector: 'current-todo-list',
  templateUrl: 'current-todo-list.component.html',
})
export class CurrentTodoListComponent {
  private readonly CLASS_NAME = 'CurrentTodoListComponent';

  @Input() public todos: Todo[];
  @Output() public addItem = new EventEmitter();
  @Output() public toggleCompleteItem = new EventEmitter<Todo>();
  @Output() public editItem = new EventEmitter<Todo>();
  @Output() public reorderItems = new EventEmitter<ReorderArrayIndexes>();
  @Output() public removeItem = new EventEmitter<Todo>();

  constructor(
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
  }
}
