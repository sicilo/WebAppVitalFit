import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoveltyTypeService } from '../../../services/novelty-type.service';
import { NoveltyType } from '../../../interfaces/novelty-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-novelty-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './novelty-type-form.component.html',
  styleUrl: './novelty-type-form.component.scss'
})
export class NoveltyTypeFormComponent {
  private dialogRef = inject(MatDialogRef<NoveltyTypeFormComponent>);
  private noveltyTypeService = inject(NoveltyTypeService);
  private fb = inject(FormBuilder);
  
  noveltyType: NoveltyType | null;
  noveltyTypeForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { noveltyType: NoveltyType | null }) {
    this.noveltyType = data.noveltyType;
    this.isEditMode = !!this.noveltyType;
    this.noveltyTypeForm = this.fb.group({
      name: [this.noveltyType?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.noveltyType?.description || ''],
      price: [this.noveltyType?.price || null, [Validators.min(0)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.noveltyTypeForm.invalid) {
      this.noveltyTypeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.noveltyTypeForm.getRawValue();

    if (this.isEditMode && this.noveltyType?.id) {
      const noveltyTypeData: NoveltyType = {
        id: this.noveltyType.id,
        ...formValue
      };

      this.noveltyTypeService.update(this.noveltyType.id, noveltyTypeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de novedad actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar tipo de novedad',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar tipo de novedad',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.noveltyTypeService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de novedad creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear tipo de novedad',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear tipo de novedad',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
