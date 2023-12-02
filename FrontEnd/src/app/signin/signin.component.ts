import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  constructor(private router: Router, private userService: UserService) {}

  email: string = '';
  password: string = '';
  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';
  errorMessage: string = '';

  signin() {
    this.userService.signin(this.email,this.password).subscribe({
      next: (response: any) => {
          localStorage.setItem('token', response.token);
    
          // You can also store other user information if needed
          localStorage.setItem('userId', response.user.id.toString());
          localStorage.setItem('userEmail', response.user.email);
          
          this.router.navigate(['/todo']);
        
      },
      error: (error) => {
        console.error('Login error:', error); 

        if (error.error.errorType === 'email') {
          this.emailErrorMessage = 'Invalid Email';
          this.passwordErrorMessage = ''; 
        } else if (error.error.errorType === 'password') {
          this.passwordErrorMessage = 'Incorrect Password';
          this.emailErrorMessage = ''; 
        } 
      }
    });
  }
}
