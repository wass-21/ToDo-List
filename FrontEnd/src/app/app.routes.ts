import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { TodolistComponent } from './todolist/todolist.component';

export const routes: Routes = [
  { path: '', component: SigninComponent },
  {path: 'signin', component: SigninComponent},
  {path: 'todo', component: TodolistComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}