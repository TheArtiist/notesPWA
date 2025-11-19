import { Injectable } from '@angular/core';
import { Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut } from '@angular/fire/auth';
import { from, Observable } from 'rxjs'; 


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  signUp(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return signOut(this.auth);
  }
}
