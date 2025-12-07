import { Injectable, inject } from '@angular/core';
import { Note } from './note';
import { Firestore, collection, doc, setDoc, deleteDoc, onSnapshot, query, where, getDocs, writeBatch } from '@angular/fire/firestore';
import { Auth, authState, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  public notes: Note[] = [];

  private db!: IDBDatabase;
  private readonly objectStoreName = "Notes";
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private user: User | null = null;

  constructor() {
    this.initIndexedDB();
    this.initFirestoreSync();
  }

  private initFirestoreSync() {
    authState(this.auth).subscribe(user => {
      this.user = user;
      if (user) {
        if (this.db) {
          this.loadNotes(user.uid);
        }

        const notesCollection = collection(this.firestore, `users/${user.uid}/notes`);
        onSnapshot(notesCollection, (snapshot) => {
          snapshot.docChanges().forEach(change => {
            const data = change.doc.data() as any;
            let id = data.id;
            if (id === undefined || id === null) {
              const parsed = parseInt(change.doc.id, 10);
              id = !isNaN(parsed) ? parsed : change.doc.id;
            }

            const note: Note = { ...data, id: id, ownerId: user.uid };

            if (change.type === 'added' || change.type === 'modified') {
              this.updateLocalNoteFromSync(note);
            } else if (change.type === 'removed') {
              this.deleteLocalNoteFromSync(id);
            }
          });
        });
      } else {
        this.notes.length = 0;
        this.user = null;
      }
    });
  }

  private updateLocalNoteFromSync(note: Note) {
    if (note.id === undefined || note.id === null) return;

    const index = this.notes.findIndex(n => n.id == note.id);
    if (index !== -1) {
      this.notes[index] = note;
    } else {
      this.notes.push(note);
    }

    if (this.db) {
      const transaction = this.db.transaction(this.objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(this.objectStoreName);
      objectStore.put(note);
    }
  }

  private deleteLocalNoteFromSync(id: number) {
    const index = this.notes.findIndex(n => n.id == id);
    if (index !== -1) {
      this.notes.splice(index, 1);
    }

    if (this.db) {
      const transaction = this.db.transaction(this.objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(this.objectStoreName);
      objectStore.delete(id);
    }
  }

  public getNoteById(id: number): Promise<Note | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(this.notes.find(n => n.id == id));
        return;
      }
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

  public updateNote(note: Note): void {
    if (this.user && !note.ownerId) {
      note.ownerId = this.user.uid;
    }

    const transaction = this.db.transaction(this.objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(this.objectStoreName);
    const request = objectStore.put(note);

    request.onsuccess = () => {
      const index = this.notes.findIndex(n => n.id == note.id);
      if (index !== -1) {
        this.notes[index] = note;
      }
      if (this.user && note.id) {
        setDoc(doc(this.firestore, `users/${this.user.uid}/notes/${note.id.toString()}`), note);
      }
    };
    request.onerror = () => {
      console.log("There was an error during the note update");
    };
  }

  public createNote(title: string, content: string, date: string): boolean {
    let note: Note = {
      title,
      content,
      date,
      ownerId: this.user?.uid
    };

    const objectStore = this.db.transaction(this.objectStoreName, "readwrite").objectStore(this.objectStoreName);
    let request = objectStore.add(note);

    request.onsuccess = (event: any) => {
      const newNote: Note = {
        ...note,
        id: event.target.result,
      };
      this.notes.push(newNote);
      if (this.user) {
        setDoc(doc(this.firestore, `users/${this.user.uid}/notes/${newNote.id!.toString()}`), newNote);
      }
    }

    request.onerror = (event: any) => {
      console.log("Hiba történt: ", event.target.error);
    }
    return true;
  }

  public loadNotes(userId?: string): void {
    if (!this.db) return;

    const transaction = this.db.transaction(this.objectStoreName, "readwrite");
    const objectStore = transaction.objectStore(this.objectStoreName);

    let request;
    if (userId && objectStore.indexNames.contains("ownerId")) {
      const index = objectStore.index("ownerId");
      request = index.openCursor(IDBKeyRange.only(userId));
    } else {
      request = objectStore.openCursor();
    }

    this.notes.length = 0;

    request.onsuccess = (event: any) => {
      const cursor = event.target.result;

      if (cursor) {
        const note = cursor.value;
        if (userId && !objectStore.indexNames.contains("ownerId")) {
          if (note.ownerId !== userId) {
            cursor.continue();
            return;
          }
        }

        if (note.id !== undefined && note.id !== null) {
          if (!this.notes.find(n => n.id == note.id)) {
            this.notes.push(note);
          }
        }
        cursor.continue();
      }
    }
  }

  public async deleteNote(id: number): Promise<void> {
    const index = this.notes.findIndex(b => b.id == id);
    if (index != -1) {
      this.notes.splice(index, 1);
    }

    if (this.db) {
      const objectStore = this.db.transaction(this.objectStoreName, 'readwrite').objectStore(this.objectStoreName);
      objectStore.delete(id);
    }

    if (this.user) {
      try {
        await deleteDoc(doc(this.firestore, `users/${this.user.uid}/notes/${id}`));

        const notesRef = collection(this.firestore, `users/${this.user.uid}/notes`);
        const q = query(notesRef, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        const batch = writeBatch(this.firestore);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();

      } catch (error) {
        console.error("Error deleting from Firestore:", error);
      }
    }
  }

  private initIndexedDB(): void {
    const request = indexedDB.open(this.objectStoreName, 4);
    request.onerror = (event: any) => {
      console.log("Database error, can't open the db: ", event.target.result);
    };

    request.onblocked = (event: any) => {
      console.warn("Database upgrade blocked. Please close other tabs.");
    };

    request.onupgradeneeded = (event: any) => {
      console.log("Upgrading DB to v4...", event);
      const db: IDBDatabase = event.target.result;

      let objectStore;
      if (!db.objectStoreNames.contains(this.objectStoreName)) {
        objectStore = db.createObjectStore(this.objectStoreName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex("titleIndex", "Title", { unique: true });
      } else {
        objectStore = event.transaction.objectStore(this.objectStoreName);
      }

      if (!objectStore.indexNames.contains("ownerId")) {
        objectStore.createIndex("ownerId", "ownerId", { unique: false });
      }
    }

    request.onsuccess = (event: any) => {
      this.db = event.target.result;
      if (this.user) {
        this.loadNotes(this.user.uid);
      }
    }
  }
}