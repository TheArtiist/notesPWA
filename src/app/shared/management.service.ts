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
    this.initIndexedDB();
  }

  public getNoteById(id: number):  void{
  
    const transaction = this.db.transaction(this.objectStoreName, "readonly");
    const objectStore = transaction.objectStore(this.objectStoreName);
    const request = objectStore.get(id);

    request.onsuccess = () => {
      
    };

    request.onerror = () => {
      
    };
  
}

public updateNote(note: Note): void {
 
    const transaction = this.db.transaction(this.objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(this.objectStoreName);
    const request = objectStore.put(note); // put = update or insert

    request.onsuccess = () => {
      const index = this.notes.findIndex(n => n.id === note.id);
      if (index !== -1) {
        this.notes[index] = note;
      }
      
    };

    request.onerror = () => {
      
    };
  
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
        ...note,
        id: event.target.result,
      };
      this.notes.push(newNote);
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

  public deleteNote(id: number): void{
  
    const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      const index = this.notes.findIndex(b => b.id == id);
      if(index != -1){
        this.notes.splice(index,1);
      }
    };

    request.onerror = (event: any) => {
      console.log('Error deleting item:', event.target.error);
    };
  
}

private initIndexedDB(): void{
  const request = indexedDB.open(this.objectStoreName,1);
  request.onerror = (event: any) => {
    console.log("Database error, can't open the db: ", event.target.result);
  }; //on error listener 

    request.onupgradeneeded = (event: any) => {
      console.log(event);
      const db: IDBDatabase = event.target.result;

      const objectStore = db.createObjectStore(this.objectStoreName, {keyPath: 'id', autoIncrement: true}); //id-ra megoldást találni
      objectStore.createIndex("titleIndex", "Title", { unique: true }); //Nice to have, de most useless nekem
    }

    request.onsuccess = (event: any) => {
        this.db = event.target.result;
        this.loadNotes();
    }
}
}
