import { Component, inject, Input } from '@angular/core';
import { Note } from '../../shared/note';
import { ManagementService } from '../../shared/management.service';

@Component({
  selector: 'app-note-cards',
  standalone: true,
  imports: [],
  templateUrl: './note-cards.component.html',
  styleUrl: './note-cards.component.scss'
})
export class NoteCardsComponent {
  @Input() note?: Note;
  @Input() title!: string;
  @Input() content!: string;
  @Input() date!: string;   
   
  private managementService = inject(ManagementService);
  constructor(){
    setInterval(() => {
       /*if(this.note){
       //ToDo
      }*/
    })
  }
}
