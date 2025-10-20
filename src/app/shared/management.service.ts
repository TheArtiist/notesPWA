import { Injectable } from '@angular/core';
import { NoteCardsComponent } from '../main-page/note-cards/note-cards.component';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  public readonly notes: NoteCardsComponent[] = [];
  constructor() { }

  public createNote(title: string, content: string, date: string){
    let note: NoteCardsComponent = {
      title,
      content,
      date
    };
    this.notes.push(note);
    return true;
  }
}
