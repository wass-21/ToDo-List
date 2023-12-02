import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TodoService } from '../todo.service';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

interface ToDo {
  title: string;
  category: string;
  dueDate: string;
  estimateValue: number;
  estimateUnit: string;
  importance: string;
  status: string;
  editMode?: boolean;
  UserId: number;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})

export class TodolistComponent implements OnInit{
  ToDoItems: ToDo[] = [];
  DoingItems: ToDo[] = [];
  DoneItems: ToDo[] = [];
  Items: ToDo[] = [];
  showQuoteBanner: boolean = true;
  UserId: number = parseInt(localStorage.getItem('userId')!, 10);
  useremail: string|null = localStorage.getItem('userEmail');


  constructor(private router: Router,private todoService : TodoService) {

   }

  ngOnInit(){
        this.fetchTodos();
    }
    fetchTodos(){
      this.todoService.getToDosByUserId(this.UserId).subscribe({
        next: (response: ToDo[]) => {
          this.Items =response;
          this.Items.forEach(todo => {
            if (todo.status === 'To Do') {
              this.ToDoItems.unshift(todo);
            } else if (todo.status === 'Doing') {
              this.DoingItems.unshift(todo);
            } else if (todo.status === 'Done') {
              this.DoneItems.unshift(todo);
            }
            console.log(todo.estimateUnit);
          });
        },
        error: (error: any) => {
          console.error('Error getting ToDos:', error);
        }
      });
    }

  hideQuote() {
    this.showQuoteBanner = false;
  }

  showQuote() {
    this.showQuoteBanner = true;
  }
  searchTerm: string = '';
search(){
  
  if (!this.searchTerm) {
    this.ToDoItems = this.Items.filter(todo => todo.status === 'To Do').reverse();
    this.DoingItems = this.Items.filter(todo => todo.status === 'Doing').reverse();
    this.DoneItems = this.Items.filter(todo => todo.status === 'Done').reverse();
    return;
}
    this.ToDoItems = this.ToDoItems.filter(todo =>
            todo.title.toLowerCase().includes(this.searchTerm.toLowerCase()) 
        );
        this.DoingItems = this.DoingItems.filter(todo =>
          todo.title.toLowerCase().includes(this.searchTerm.toLowerCase()) 
      );
      this.DoneItems = this.DoneItems.filter(todo =>
        todo.title.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
}
drop(event: CdkDragDrop<ToDo[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    const droppedItem = event.previousContainer.data[event.previousIndex];
    
    // Update the status of the dropped item based on the target list
    if (event.container.id === 'ToDoList') {
      droppedItem.status = 'To Do';
    } else if (event.container.id === 'DoingList') {
      droppedItem.status = 'Doing';
    } else if (event.container.id === 'DoneList') {
      droppedItem.status = 'Done';
    }
    this.todoService.updateTodo(droppedItem).subscribe({
      next: (response: any) => {
        

      },
      error: (error: any) => {
        console.error('Error updating ToDo:', error);
      },
    });
    transferArrayItem(event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex);
  }
}






  addItem() {
    const newItem: ToDo = {
      title: '',
      category: '',
      dueDate: '',
      estimateValue: 0,
      estimateUnit: '',
      importance: '',
      status: 'To Do',
      UserId: this.UserId
    };
    this.todoService.CreateTodo(newItem).subscribe({
      next: () => {
        this.ToDoItems.splice(0, this.ToDoItems.length);
        this.DoingItems.splice(0, this.DoingItems.length);
        this.DoneItems.splice(0, this.DoneItems.length);

        this.fetchTodos(); 
      },
      error: (error: any) => {
        console.error('Error adding ToDo:', error);
      },
    });
  }

  enableEditMode(todo: ToDo) {
    todo.editMode = true;
  }

  disableEditMode(todo: ToDo) {

    todo.editMode = false;
    this.todoService.updateTodo(todo).subscribe({
      next: (response: any) => {
        

      },
      error: (error: any) => {
        console.error('Error updating ToDo:', error);
      },
    });
  }

  showTooltip() {
    var tooltip = document.getElementById("myTooltip");
    if (tooltip) {
      tooltip.style.visibility = (tooltip.style.visibility === "hidden" || tooltip.style.visibility === "") ? "visible" : "hidden";
    }
  }

  logout() {
    this.router.navigate(['/signin']);
  }
  getImportanceClass(importance: string): string {
    switch (importance.toLowerCase()) {
      case 'high':
        return 'high-importance';
      case 'medium':
        return 'medium-importance';
      case 'low':
        return 'low-importance';
      default:
        return '';
    }
  }

}
