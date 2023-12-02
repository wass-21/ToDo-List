import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient) { }

  getToDosByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://localhost:7187/api/ToDo/${userId}`);
  }

  CreateTodo(todo: any): Observable<any> {
    return this.http.post(`https://localhost:7187/api/ToDo`, todo);
  }

  updateTodo(todo: any): Observable<any> {
    return this.http.put(`https://localhost:7187/api/ToDo`, todo);
  }
}
