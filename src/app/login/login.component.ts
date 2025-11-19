import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'login',
  templateUrl: './login.component.html',
  imports:[CommonModule, ReactiveFormsModule],
  styleUrls: ['./login.component.scss']
  
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  public login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Belépés:', email, password);
      this.authService.login(email, password)
        .subscribe({
          next: (userCredential: any) => {
            console.log('Sikeres bejelentkezés:', userCredential.user);
            this.router.navigate(['mainPage']);
          },
          error: (error: any) => {
            console.error('Bejelentkezési hiba:', error);
          }
        });
    }
  }

  public signup(): void{
    this.router.navigate(['signup']);
  }

  
}
