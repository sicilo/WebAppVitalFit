import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BloodTypeService } from '../../../services/blood-type.service';
import { BloodType } from '../../../interfaces/blood-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blood-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './blood-type-form.component.html',
  styleUrl: './blood-type-form.component.scss'
})
export class BloodTypeFormComponent {
  private dialogRef = inject(MatDialogRef<BloodTypeFormComponent>);
  private bloodTypeService = inject(BloodTypeService);
  private fb = inject(FormBuilder);
  
  bloodType: BloodType | null;
  bloodTypeForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { bloodType: BloodType | null }) {
    this.bloodType = data.bloodType;
    this.isEditMode = !!this.bloodType;
    this.bloodTypeForm = this.fb.group({
      name: [this.bloodType?.name || '', [Validators.required, Validators.minLength(2)]],
      description: [this.bloodType?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bloodTypeForm.invalid) {
      this.bloodTypeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.bloodTypeForm.getRawValue();

    if (this.isEditMode && this.bloodType?.id) {
      const bloodTypeData: BloodType = {
        id: this.bloodType.id,
        ...formValue
      };

      this.bloodTypeService.update(this.bloodType.id, bloodTypeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de sangre actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar tipo de sangre',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar tipo de sangre',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.bloodTypeService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de sangre creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear tipo de sangre',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear tipo de sangre',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
