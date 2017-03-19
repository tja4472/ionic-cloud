import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { CompletedTodoService } from '../../services/completed-todo.service';
import { CurrentTodoService } from '../../services/current-todo.service';

import { TodoCompleted } from '../../models/todo-completed';
import { CompletedTodoDetailPage, ModalResult } from '../completed-todo-detail/completed-todo-detail.page';

@Component({
  selector: 'page-completed-todos',
  templateUrl: 'completed-todos.page.html'
})
export class CompletedTodosPage {
  data$: Observable<TodoCompleted[]>;

  constructor(
    private completedTodoService: CompletedTodoService,
    private currentTodoService: CurrentTodoService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
  ) {
    console.log('CompletedTodosPage:constructor')
    this.data$ = completedTodoService.todos;
  }

  ionViewDidLoad() {
    // this.todoCompletedService.initialise();
  }

  checkItem(item: TodoCompleted) {
    if (!item.isComplete) {
      this.currentTodoService.moveToCurrent(item);
    }
  }

  editItem(item: TodoCompleted) {
    console.log('editItem:item>', item);

    let modal = this.modalCtrl.create(CompletedTodoDetailPage, { todo: item });

    modal.onDidDismiss((modalResult: ModalResult) => {
      console.log('editItem:onDidDismiss>: modalResult', modalResult);

      if (modalResult.isCancelled) {
        return;
      }

      if (modalResult.isRemoved) {
        this.completedTodoService.removeItem(modalResult.todo);
        return;
      }

      if (modalResult.todo.isComplete) {
        this.completedTodoService.saveItem(modalResult.todo);
      } else {
        this.currentTodoService.moveToCurrent(modalResult.todo);
      }
    });

    modal.present();
  }

  ionViewDidLeave() {
    console.log('CompletedTodosPage:ionViewDidLeave');
  }
}
