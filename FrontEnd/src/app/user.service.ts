import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  
  signin(email: string, password: string): Observable<any> {
    return this.http.post('https://localhost:7187/api/User/signin', { email, password });
  }
}

