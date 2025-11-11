import { Component, NgModule } from '@angular/core';
import { NoteCardsComponent } from './note-cards/note-cards.component';
import { Note } from '../shared/note';
import { ManagementService } from '../shared/management.service';
import { Router } from '@angular/router';
import { HoverHighlightDirective } from '../shared/hover-highlight.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
export class MainPageComponent {
  public notes: Note[];
  public searchTerm: string = '';

  constructor(
    private managementService: ManagementService,
    private router: Router
  ){
    this.notes=this.managementService.notes;
  }

  public createNote(): void{
    this.router.navigate(['createNote']);
    
  }

  public onDeleteNote(id: number):void{
    //for debugging - console.log("main-page");
    this.managementService.deleteNote(id).then(() => {
    this.notes = this.managementService.notes; 
  });
  }

  public onEditNote(id: number):void{
    
  }
}