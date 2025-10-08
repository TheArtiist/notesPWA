import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
    {
        path: "login",
        //component: LoginComponent
        loadComponent: () => import("./login/login.component").then(c => c.LoginComponent)
    },
    {
        path: "signup",
        //component: SignupComponent
        loadComponent: () => import("./signup/signup.component").then(c => c.SignupComponent)
    },
    {
        path: "mainPage",
        //component: MainPageComponent
        loadComponent: () => import("./main-page/main-page.component").then(c => c.MainPageComponent)
    },
    {
        path: "**",
        redirectTo: "login"
    }
];
