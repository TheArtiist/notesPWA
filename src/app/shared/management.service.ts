import { Injectable } from '@angular/core';
import { NoteCardsComponent } from '../main-page/note-cards/note-cards.component';
import { Note } from './note';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  public notes: Note[] = [
    {
      title: "Teszt",
      content: "Ez egy teszt szöveg",
      date: "2025.10.20"
    }
  ];
  
  private db!:IDBDatabase;
  private readonly objectStoreName = "Notes";
  constructor() 
  {
    const request = indexedDB.open("notes-db",1);

    request.onerror = (event: any) => {
      console.log("DB error: ", event.target.error);
    }; //on error listener 

    request.onupgradeneeded = (event: any) => {
      console.log(event);
      const db: IDBDatabase = event.target.result;

      const objectStore = db.createObjectStore(this.objectStoreName, {keyPath: 'id', autoIncrement: true}); //id-ra megoldást találni
      objectStore.createIndex("titleIndex", "Title", { unique: true }); //Nice to have, de most useless nekem
    }

    request.onsuccess = (event: any) => {
        this.db = event.target.result; //ToDo
    }
  }

  public getNoteById(id: number): Promise<Note | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction(this.objectStoreName, "readonly");
    const objectStore = transaction.objectStore(this.objectStoreName);
    const request = objectStore.get(id);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

public updateNote(note: Note): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction(this.objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(this.objectStoreName);
    const request = objectStore.put(note); // put = update or insert

    request.onsuccess = () => {
      const index = this.notes.findIndex(n => n.id === note.id);
      if (index !== -1) {
        this.notes[index] = note;
      }
      resolve(true);
    };

    request.onerror = () => {
      reject(false);
    };
  });
}


  public createNote(title: string, content: string, date: string){
    let note: Note = { //Note típus legyen
      title,
      content,
      date
    };

    const objectStore = this.db.transaction(this.objectStoreName, "readwrite").objectStore(this.objectStoreName);
    const request = objectStore.add(note); //Edit-nél put-ot kell használni

    request.onsuccess= (event: any) => {
      const newNote: Note = { 
        ...note
      }
      this.notes.push(note);
    }


    
    return true;
  }

  public loadNotes(): void{
    const objectStore = this.db.transaction(this.objectStoreName, "readwrite").objectStore(this.objectStoreName);
    
    const request = objectStore.openCursor();
    request.onsuccess = (event: any) => {
      const cursor = event.target.result;

      if(cursor){
        this.notes.push(cursor.value);
      }
      cursor.continue();
    }
  }

  public deleteNote(id: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction(this.objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(this.objectStoreName);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      this.notes = this.notes.filter(n => n.id !== id);
      resolve(true);
    };

    request.onerror = () => {
      reject(false);
    };
  });
}


}
