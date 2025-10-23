import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ManagementService } from '../shared/management.service';
import { Note } from '../shared/note';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'createNote',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-note.component.html',
  styleUrl: './create-note.component.scss'
})
export class CreateNoteComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute); 
  private router = inject(Router);
  private managementService = inject(ManagementService);

  noteForm!: FormGroup;
  editingNoteId?: number;

 ngOnInit(): void {
  this.noteForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.managementService.getNoteById(+id);
  }
}


  onSubmit(): void {
  const note: Note = {
    ...this.noteForm.value,
    date: new Date().toISOString(),
    
  };
  if (this.editingNoteId !== undefined) {
    note.id= this.editingNoteId;
    this.managementService.updateNote(note);
    this.router.navigate(['mainPage']);
  } else {
    this.managementService.createNote(note.title, note.content, note.date);
    this.router.navigate(['mainPage']);
  }
}
}