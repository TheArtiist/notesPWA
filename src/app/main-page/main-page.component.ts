import { Component } from '@angular/core';
import { NoteCardsComponent } from './note-cards/note-cards.component';
import { Note } from '../shared/note';
import { ManagementService } from '../shared/management.service';
import { Router } from '@angular/router';


@Component({
  selector: 'mainPage',
  standalone: true,
  imports: [
    NoteCardsComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  public readonly notes: Note[];

  constructor(
    private managementService: ManagementService,
    private router: Router
  ){
    this.notes=this.managementService.notes;
  }

  public createNote(): void{
    this.router.navigate(['createNote']);
    
  }

}
