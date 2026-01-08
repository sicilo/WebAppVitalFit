import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BundleService } from '../../../services/bundle.service';
import { Bundle } from '../../../interfaces/bundle.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bundle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './bundle-form.component.html',
  styleUrl: './bundle-form.component.scss'
})
export class BundleFormComponent {
  private dialogRef = inject(MatDialogRef<BundleFormComponent>);
  private bundleService = inject(BundleService);
  private fb = inject(FormBuilder);
  
  bundle: Bundle | null;
  bundleForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { bundle: Bundle | null }) {
    this.bundle = data.bundle;
    this.isEditMode = !!this.bundle;
    this.bundleForm = this.fb.group({
      name: [this.bundle?.name || '', [Validators.required, Validators.minLength(3)]],
      price: [this.bundle?.price || null, [Validators.required, Validators.min(0)]],
      description: [this.bundle?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.bundleForm.invalid) {
      this.bundleForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.bundleForm.getRawValue();

    if (this.isEditMode && this.bundle?.id) {
      const bundleData: Bundle = {
        id: this.bundle.id,
        ...formValue
      };

      this.bundleService.update(this.bundle.id, bundleData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Paquete actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar paquete',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar paquete',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.bundleService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Paquete creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear paquete',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear paquete',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
