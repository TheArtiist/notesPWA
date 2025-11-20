import { Component, NgModule, OnInit } from '@angular/core';
import { NoteCardsComponent } from './note-cards/note-cards.component';
import { Note } from '../shared/note';
import { ManagementService } from '../shared/management.service';
import { SearchService } from '../shared/search.service';
import { Router } from '@angular/router';
import { HoverHighlightDirective } from '../shared/hover-highlight.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'mainPage',
  standalone: true,
  imports: [
    NoteCardsComponent,
    HoverHighlightDirective,
    FormsModule,
    CommonModule
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  public notes: Note[] = [];
  public searchTerm: string = '';
  public filteredNotes$: Observable<Note[]>;

  constructor(
    private managementService: ManagementService,
    private searchService: SearchService,
    private router: Router
  ){
    this.notes = this.managementService.notes;
    this.filteredNotes$ = this.searchService.getFilteredNotes();
  }

  ngOnInit(): void {
    // Frissítjük a search service-ben a jegyzeteket
    this.searchService.updateNotes(this.managementService.notes);
  }

  public onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchService.updateSearchTerm(searchTerm);
  }

  public createNote(): void{
    this.router.navigate(['createNote']);
    
  }

  public onDeleteNote(id: number):void{
    //for debugging - console.log("main-page");
    this.managementService.deleteNote(id).then(() => {
      this.notes = this.managementService.notes;
      // Frissítjük a search service-ben a jegyzeteket
      this.searchService.updateNotes(this.notes);
    });
  }

  public onEditNote(id: number):void{
    
  }
}