import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from './note';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm$ = this.searchTermSubject.asObservable();

  private notesSubject = new BehaviorSubject<Note[]>([]);
  public notes$ = this.notesSubject.asObservable();

  public filteredNotes$: Observable<Note[]>;

  constructor() {
    // Kombináljuk a keresési termet és a jegyzeteket, majd szűrjük
    this.filteredNotes$ = this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(searchTerm => {
        const notes = this.notesSubject.value;
        if (!searchTerm.trim()) {
          return notes;
        }
        const lowerSearchTerm = searchTerm.toLowerCase();
        return notes.filter(note =>
          note.title.toLowerCase().includes(lowerSearchTerm) ||
          note.content.toLowerCase().includes(lowerSearchTerm)
        );
      })
    );
  }

  // Frissítjük a keresési termet
  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  // Frissítjük a jegyzeteket
  updateNotes(notes: Note[]): void {
    this.notesSubject.next(notes);
  }

  // Observable-t adunk vissza a keresési termhez
  getSearchTerm(): Observable<string> {
    return this.searchTerm$;
  }

  // Observable-t adunk vissza a szűrt jegyzetekhez
  getFilteredNotes(): Observable<Note[]> {
    return this.filteredNotes$;
  }
}
