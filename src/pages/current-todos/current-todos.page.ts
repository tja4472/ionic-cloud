import { Component } from '@angular/core';

import {
  ModalController,
  NavController,
  PopoverController,
} from 'ionic-angular';

// import { Database } from '@ionic/cloud-angular';

import { Observable } from 'rxjs/Observable';

import { CurrentTodoService } from '../../services/current-todo.service';
import { Todo } from '../../models/todo';

import { CurrentTodoDetailPage } from '../current-todo-detail/current-todo-detail.page';
import { MyPopoverPage, MyPopoverPageResult } from '../../components/popover/popover.component';

@Component({
  selector: 'current-todos-page',
  templateUrl: 'current-todos.page.html'
})
export class CurrentTodosPage {
  todos$: Observable<Todo[]>;

  constructor(
   // public db: Database,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,    
    private todoService: CurrentTodoService,
  ) {
    console.log('TodosPage:constructor')
     this.todos$ = this.todoService.todos;
  }

  createItem() {
    console.log('createItem');
    let modal = this.modalCtrl.create(CurrentTodoDetailPage);

    modal.onDidDismiss((data: Todo) => {
      console.log('onDidDismiss>', data);

      if (!!data) {
        this.todoService.saveItem(data);
      }
    });

    modal.present()
  }

  toggleCompleteItem(item: Todo) {
    console.log('completeItem:item>', item);
    this.todoService.toggleCompleteItem(item);
  }

  editItem(item: Todo) {
    console.log('editItem:item>', item);
    // let todo: ToDo;
    // todo = assign(todo, item);


    let modal = this.modalCtrl.create(CurrentTodoDetailPage, { todo: item });

    modal.onDidDismiss((data: Todo) => {
      console.log('onDidDismiss>', data);

      if (!!data) {
        this.todoService.saveItem(data);
      }
    });

    modal.present();
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create(MyPopoverPage);

    popover.onDidDismiss((result: MyPopoverPageResult) => {
      console.log('popover.onDidDismiss>', result);

      if (!!!result) {
        // no result.
        console.log('result is null.');
        return;
      }

      console.log('result.clearCompleted>', result.clearCompleted);
      if (result.clearCompleted) {
        // this.todoService.clearCompletedItems();
        return;
      }
    });
  
    popover.present({
      ev: ev
    });
  }

  reorderItems(indexes: any) {
    console.log('reorderItems:indexes>', indexes);
    console.log('reorderItems:indexes.from>', indexes.from);
    console.log('reorderItems:indexes.to>', indexes.to);
    this.todoService.reorderItems(indexes);
    // http://ionicframework.com/docs/v2/api/components/item/ItemReorder/
    // this.items = reorderArray(this.items, indexes);
  }

  removeItem(item: Todo) {
    console.log('removeItem:item>', item);
    this.todoService.removeItem(item);
  }

  ionViewDidLeave() {
    console.log('TodosPage:ionViewDidLeave');    
  }
}   
