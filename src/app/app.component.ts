import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; 
import { LoginComponent } from './login/login.component'; 
import { SwUpdate } from '@angular/service-worker';
import { from, interval, Observable, of } from 'rxjs';

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
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    interval(3000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
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

  title = 'notespwa';
}
