import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Note } from '../../shared/note';
import { ManagementService } from '../../shared/management.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-note-cards',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './note-cards.component.html',
  styleUrl: './note-cards.component.scss'
})
export class NoteCardsComponent {
  @Input() note?: Note;
  @Input() title!: string;
  @Input() content!: string;
  @Input() date!: string;   
  @Output() delete = new EventEmitter <number>();
   
  private managementService = inject(ManagementService);
  constructor(){
    setInterval(() => {
       /*if(this.note){
       //ToDo
      }*/
    })
  }
  public deleteNote(){
    console.log("emitter");
    if(this.note) this.delete.emit(this.note.id);
    
  }
}
