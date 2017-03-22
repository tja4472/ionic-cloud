import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../models/todo';


export type ToggleCompleteItemOutput = Todo;
export type EditItemOutput = Todo;
export type ReorderItemsOutput = {
  from: number,
  to: number
};
export type RemoveItemOutput = Todo;
export type TodosInput = Todo[];

@Component({
  selector: 'current-todo-list',
  templateUrl: 'current-todo-list.component.html',
})
export class CurrentTodoListComponent {
  private readonly CLASS_NAME = 'CurrentTodoListComponent';

  @Input() public todos: TodosInput;
  @Output() public addItem = new EventEmitter();
  @Output() public toggleCompleteItem = new EventEmitter<ToggleCompleteItemOutput>();
  @Output() public editItem = new EventEmitter<EditItemOutput>();
  @Output() public reorderItems = new EventEmitter<ReorderItemsOutput>();
  @Output() public removeItem = new EventEmitter<RemoveItemOutput>();

  constructor(
  ) {
    console.log(`%s:constructor`, this.CLASS_NAME);
  }

  checkboxChange(checkbox: any, item: any) {
    console.log('checkboxChange');
  }
}
