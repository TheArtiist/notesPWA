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

  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  updateNotes(notes: Note[]): void {
    this.notesSubject.next(notes);
  }

  getSearchTerm(): Observable<string> {
    return this.searchTerm$;
  }

  getFilteredNotes(): Observable<Note[]> {
    return this.filteredNotes$;
  }
}
