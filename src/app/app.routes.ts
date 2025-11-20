import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MainPageComponent } from './main-page/main-page.component';
import { authGGuard } from './auth-g.guard';

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
        loadComponent: () => import("./main-page/main-page.component").then(c => c.MainPageComponent),
        canActivate: [authGGuard]
    },
    {
        path: "createNote",
        //component: CreateNoteComponent
        loadComponent: () => import("./create-note/create-note.component").then(c => c.CreateNoteComponent),
        canActivate: [authGGuard]
    },
    {
        path: "createNote/:id",
        //component: CreateNoteComponent
        loadComponent: () => import("./create-note/create-note.component").then(c => c.CreateNoteComponent),
        canActivate: [authGGuard]
    },
    {
        path: "**",
        redirectTo: "login"
    }
];
