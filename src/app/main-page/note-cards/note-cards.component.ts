import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-note-cards',
  standalone: true,
  imports: [],
  templateUrl: './note-cards.component.html',
  styleUrl: './note-cards.component.scss'
})
export class NoteCardsComponent {
  @Input() note!: NoteCardsComponent 
  @Input() title!: string;
  @Input() content!: string;
  @Input() date!: string; //Last update date
   
  constructor(){
    setInterval(() => {
      if(this.note){
       //ToDo
      }
    })
  }
}
