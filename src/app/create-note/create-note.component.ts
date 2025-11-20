import { Component, inject, OnInit } from '@angular/core';
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
export class CreateNoteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute); 
  private router = inject(Router);
  private managementService = inject(ManagementService);

  noteForm!: FormGroup;
  isEditMode = false;
  currentNoteId?: number;

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentNoteId = +id;
      this.loadNoteForEdit(+id);
    }
  }

  private loadNoteForEdit(id: number): void {
    this.managementService.getNoteById(id).then((note) => {
      if (note) {
        this.noteForm.patchValue({
          title: note.title,
          content: note.content
        });
      }
    }).catch((error) => {
      console.error('Hiba a jegyzet betöltésekor:', error);
    });
  }

  onSubmit(): void {
    if (this.noteForm.invalid) {
      return;
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const dateforFormatting = new Date();
    const dateFormatted: string = dateforFormatting.toLocaleDateString(undefined, options);

    if (this.isEditMode && this.currentNoteId) {
      const updatedNote: Note = {
        id: this.currentNoteId,
        ...this.noteForm.value,
        date: dateFormatted
      };
      this.managementService.updateNote(updatedNote);
    } else {
      this.managementService.createNote(
        this.noteForm.value.title,
        this.noteForm.value.content,
        dateFormatted
      );
    }

    this.router.navigate(['mainPage']);
  }

  public cancelButton(): void {
    this.router.navigate(['mainPage']);
  }
}