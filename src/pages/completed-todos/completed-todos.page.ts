import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { CompletedTodoService } from '../../services/completed-todo.service';

import { TodoCompleted } from '../../models/todo-completed';
// import { ModalResult, TodoCompletedPage } from '../todo-completed/todo-completed.page';

@Component({
  selector: 'page-completed-todos',
  templateUrl: 'completed-todos.page.html'
})
export class CompletedTodosPage {
  data$: Observable<TodoCompleted[]>;

  constructor(
    private completedTodoService: CompletedTodoService,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
  ) {
    //
    // this.data$ = todoCompletedService.getData();
    this.data$ = completedTodoService.todos;
  }

  ionViewDidLoad() {
    // this.todoCompletedService.initialise();
  }

  checkItem(item: TodoCompleted) {
    if (!item.isComplete) {
      // this.todoCompletedService.moveToCurrent(item);
    }
  }

  editItem(item: TodoCompleted) {
    console.log('editItem:item>', item);
    /*    
        let modal = this.modalCtrl.create(TodoCompletedPage, { todo: item });
    
        //    modal.onDidDismiss(data => {
        modal.onDidDismiss((modalResult: ModalResult) => {
          console.log('editItem:onDidDismiss>: modalResult', modalResult);
    
          if (modalResult.isCancelled) {
            return;
          }
    
          if (modalResult.isRemoved) {
            // this.todoCompletedService.remove(modalResult.todo);
            return;
          }
    
          if (modalResult.todo.isComplete) {
            // this.todoCompletedService.save(modalResult.todo);
          } else {
            // this.todoCompletedService.moveToCurrent(modalResult.todo);
          }
        });
    
        modal.present();
    */
  }
  /*
    removeItem(item: RemoveItemOutput) {
      console.log('removeItem:item>', item);
      this.todoCompletedService.remove(item);
    }
  */
}
