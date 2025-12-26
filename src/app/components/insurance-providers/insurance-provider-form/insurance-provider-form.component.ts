import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { InsuranceProviderService } from '../../../services/insurance-provider.service';
import { InsuranceProvider } from '../../../interfaces/insurance-provider.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insurance-provider-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './insurance-provider-form.component.html',
  styleUrl: './insurance-provider-form.component.scss'
})
export class InsuranceProviderFormComponent {
  private dialogRef = inject(MatDialogRef<InsuranceProviderFormComponent>);
  private insuranceProviderService = inject(InsuranceProviderService);
  private fb = inject(FormBuilder);
  
  provider: InsuranceProvider | null;
  providerForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { provider: InsuranceProvider | null }) {
    this.provider = data.provider;
    this.isEditMode = !!this.provider;
    this.providerForm = this.fb.group({
      name: [this.provider?.name || '', [Validators.required, Validators.minLength(3)]],
      code: [this.provider?.code || ''],
      phone: [this.provider?.phone || ''],
      email: [this.provider?.email || '', [Validators.email]],
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
      const providerData: InsuranceProvider = {
        id: this.provider.id,
        ...this.providerForm.value
      };

      this.insuranceProviderService.update(this.provider.id, providerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'EPS/Aseguradora actualizada correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar EPS/Aseguradora',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar EPS/Aseguradora',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.insuranceProviderService.create(this.providerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'EPS/Aseguradora creada correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear EPS/Aseguradora',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear EPS/Aseguradora',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
