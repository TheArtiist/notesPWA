import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 
import { LoginComponent } from './login/login.component'; 
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  
  private swUpdate = inject(SwUpdate);
  private onlineCallback = () => console.log("online");
  private offlineCallback = () => console.log("offline");

  ngOnInit(): void {
    interval(3000).subscribe(() => {
      this.swUpdate.checkForUpdate().then(
        update => {
          if(update){
            alert("New changes");
            window.location.reload();
          }
        }
      )
    });

    window.addEventListener('online',this.onlineCallback);
    window.addEventListener('offline',this.offlineCallback);
  }

  ngOnDestroy(): void {
      window.removeEventListener('online',this.onlineCallback);
      window.removeEventListener('online',this.offlineCallback);
  }

  title = 'notesPWA';
}
