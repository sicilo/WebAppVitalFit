import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GenderService } from '../../../services/gender.service';
import { Gender } from '../../../interfaces/gender.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gender-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './gender-form.component.html',
  styleUrl: './gender-form.component.scss'
})
export class GenderFormComponent {
  private dialogRef = inject(MatDialogRef<GenderFormComponent>);
  private genderService = inject(GenderService);
  private fb = inject(FormBuilder);
  
  gender: Gender | null;
  genderForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { gender: Gender | null }) {
    this.gender = data.gender;
    this.isEditMode = !!this.gender;
    this.genderForm = this.fb.group({
      name: [this.gender?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.gender?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.genderForm.invalid) {
      this.genderForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.genderForm.getRawValue();

    if (this.isEditMode && this.gender?.id) {
      const genderData: Gender = {
        id: this.gender.id,
        ...formValue
      };

      this.genderService.update(this.gender.id, genderData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Género actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar género',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar género',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.genderService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Género creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear género',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear género',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
