import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { JobTitleService } from '../../../services/job-title.service';
import { JobTitle } from '../../../interfaces/job-title.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-title-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './job-title-form.component.html',
  styleUrl: './job-title-form.component.scss'
})
export class JobTitleFormComponent {
  private dialogRef = inject(MatDialogRef<JobTitleFormComponent>);
  private jobTitleService = inject(JobTitleService);
  private fb = inject(FormBuilder);
  
  jobTitle: JobTitle | null;
  jobTitleForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { jobTitle: JobTitle | null }) {
    this.jobTitle = data.jobTitle;
    this.isEditMode = !!this.jobTitle;
    this.jobTitleForm = this.fb.group({
      name: [this.jobTitle?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.jobTitle?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.jobTitleForm.invalid) {
      this.jobTitleForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.jobTitleForm.getRawValue();

    if (this.isEditMode && this.jobTitle?.id) {
      const jobTitleData: JobTitle = {
        id: this.jobTitle.id,
        ...formValue
      };

      this.jobTitleService.update(this.jobTitle.id, jobTitleData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Cargo actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar cargo',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar cargo',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.jobTitleService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Cargo creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear cargo',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear cargo',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
