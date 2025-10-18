import { Component } from '@angular/core';
import { NoteCardsComponent } from './note-cards/note-cards.component';


@Component({
  selector: 'mainPage',
  standalone: true,
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  public readonly notes!: NoteCardsComponent[];

  constructor(
    
  ){
    //ToDo
  }
}
