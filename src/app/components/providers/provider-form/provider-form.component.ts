import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProviderService } from '../../../services/provider.service';
import { Provider } from '../../../interfaces/provider.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-provider-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './provider-form.component.html',
  styleUrl: './provider-form.component.scss'
})
export class ProviderFormComponent {
  private dialogRef = inject(MatDialogRef<ProviderFormComponent>);
  private providerService = inject(ProviderService);
  private fb = inject(FormBuilder);
  
  provider: Provider | null;
  providerForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { provider: Provider | null }) {
    this.provider = data.provider;
    this.isEditMode = !!this.provider;
    this.providerForm = this.fb.group({
      name: [this.provider?.name || '', [Validators.required, Validators.minLength(3)]],
      nit: [this.provider?.nit || ''],
      phone: [this.provider?.phone || ''],
      email: [this.provider?.email || '', [Validators.email]],
      address: [this.provider?.address || ''],
      contactPerson: [this.provider?.contactPerson || ''],
      description: [this.provider?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.providerForm.invalid) {
      this.providerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.provider?.id) {
      const providerData: Provider = {
        id: this.provider.id,
        ...this.providerForm.value
      };

      this.providerService.update(this.provider.id, providerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Proveedor actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar proveedor',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar proveedor',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.providerService.create(this.providerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Proveedor creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear proveedor',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear proveedor',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
