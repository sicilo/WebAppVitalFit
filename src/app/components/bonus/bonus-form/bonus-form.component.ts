import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BonusService } from '../../../services/bonus.service';
import { Bonus } from '../../../interfaces/bonus.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bonus-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './bonus-form.component.html',
  styleUrl: './bonus-form.component.scss'
})
export class BonusFormComponent {
  private dialogRef = inject(MatDialogRef<BonusFormComponent>);
  private bonusService = inject(BonusService);
  private fb = inject(FormBuilder);
  
  bonus: Bonus | null;
  bonusForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { bonus: Bonus | null }) {
    this.bonus = data.bonus;
    this.isEditMode = !!this.bonus;
    this.bonusForm = this.fb.group({
      name: [this.bonus?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.bonus?.description || ''],
      sessions: [this.bonus?.sessions || null, [Validators.min(1)]],
      price: [this.bonus?.price || null, [Validators.min(0)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bonusForm.invalid) {
      this.bonusForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Get raw value to include disabled fields
    const formValue = this.bonusForm.getRawValue();

    if (this.isEditMode && this.bonus?.id) {
      const bonusData: Bonus = {
        id: this.bonus.id,
        ...formValue
      };

      this.bonusService.update(this.bonus.id, bonusData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: 'Â¡Ã‰xito!',
              text: 'Bono actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar bono',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar bono',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.bonusService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: 'Â¡Ã‰xito!',
              text: 'Bono creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear bono',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear bono',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
