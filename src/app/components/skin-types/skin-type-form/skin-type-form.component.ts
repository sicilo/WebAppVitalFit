import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SkinTypeService } from '../../../services/skin-type.service';
import { SkinType } from '../../../interfaces/skin-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skin-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './skin-type-form.component.html',
  styleUrl: './skin-type-form.component.scss'
})
export class SkinTypeFormComponent {
  private dialogRef = inject(MatDialogRef<SkinTypeFormComponent>);
  private skinTypeService = inject(SkinTypeService);
  private fb = inject(FormBuilder);
  
  skinType: SkinType | null;
  skinTypeForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { skinType: SkinType | null }) {
    this.skinType = data.skinType;
    this.isEditMode = !!this.skinType;
    this.skinTypeForm = this.fb.group({
      name: [this.skinType?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.skinType?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.skinTypeForm.invalid) {
      this.skinTypeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.skinType?.id) {
      const skinTypeData: SkinType = {
        id: this.skinType.id,
        ...this.skinTypeForm.value
      };

      this.skinTypeService.update(this.skinType.id, skinTypeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de piel actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar tipo de piel',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar tipo de piel',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.skinTypeService.create(this.skinTypeForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de piel creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear tipo de piel',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear tipo de piel',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
