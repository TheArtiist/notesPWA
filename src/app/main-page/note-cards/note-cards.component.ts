import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Note } from '../../shared/note';
import { ManagementService } from '../../shared/management.service';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { HighLightPipe } from '../../shared/high-light.pipe';
import { Router } from '@angular/router';


@Component({
  selector: 'app-note-cards',
  standalone: true,
  imports: [MatButton, CommonModule, HighLightPipe],
  templateUrl: './note-cards.component.html',
  styleUrls: ['./note-cards.component.scss']
})
export class NoteCardsComponent {
  @Input() searchTerm: string = '';
  @Input() note?: Note;
  @Input() title!: string;
  @Input() content!: string;
  @Input() date!: string;
  @Input() id!: number;
  @Output() delete = new EventEmitter <number>();
  
   
  private managementService = inject(ManagementService);
  private router = inject(Router);
  
  constructor(){}
  
  public deleteNote(): void{
    if(this.note) this.delete.emit(this.note.id);
    
  }
  
  public editNote(): void{
    if(this.id) {
      this.router.navigate(['createNote', this.id]);
    }
  }
}