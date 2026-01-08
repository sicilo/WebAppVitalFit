import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RoomTypeService } from '../../../services/room-type.service';
import { RoomType } from '../../../interfaces/room-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './room-type-form.component.html',
  styleUrl: './room-type-form.component.scss'
})
export class RoomTypeFormComponent {
  private dialogRef = inject(MatDialogRef<RoomTypeFormComponent>);
  private roomTypeService = inject(RoomTypeService);
  private fb = inject(FormBuilder);
  
  roomType: RoomType | null;
  roomTypeForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { roomType: RoomType | null }) {
    this.roomType = data.roomType;
    this.isEditMode = !!this.roomType;
    this.roomTypeForm = this.fb.group({
      name: [this.roomType?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.roomType?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.roomTypeForm.invalid) {
      this.roomTypeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.roomTypeForm.getRawValue();

    if (this.isEditMode && this.roomType?.id) {
      const roomTypeData: RoomType = {
        id: this.roomType.id,
        ...formValue
      };

      this.roomTypeService.update(this.roomType.id, roomTypeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de sala actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar tipo de sala',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar tipo de sala',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.roomTypeService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de sala creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear tipo de sala',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear tipo de sala',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
