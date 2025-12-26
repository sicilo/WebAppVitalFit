import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ServiceCategoryService } from '../../../services/service-category.service';
import { ServiceCategory } from '../../../interfaces/service-category.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './service-category-form.component.html',
  styleUrl: './service-category-form.component.scss'
})
export class ServiceCategoryFormComponent {
  private dialogRef = inject(MatDialogRef<ServiceCategoryFormComponent>);
  private serviceCategoryService = inject(ServiceCategoryService);
  private fb = inject(FormBuilder);
  
  category: ServiceCategory | null;
  categoryForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  serviceTypes = [
    { value: 'facial', label: 'Facial' },
    { value: 'corporal', label: 'Corporal' },
    { value: 'laser', label: 'Láser' },
    { value: 'otro', label: 'Otro' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { category: ServiceCategory | null }) {
    this.category = data.category;
    this.isEditMode = !!this.category;
    this.categoryForm = this.fb.group({
      name: [this.category?.name || '', [Validators.required, Validators.minLength(3)]],
      type: [this.category?.type || '', [Validators.required]],
      description: [this.category?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.category?.id) {
      const categoryData: ServiceCategory = {
        id: this.category.id,
        ...this.categoryForm.value
      };

      this.serviceCategoryService.update(this.category.id, categoryData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Categoría actualizada correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar categoría',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar categoría',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.serviceCategoryService.create(this.categoryForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Categoría creada correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear categoría',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear categoría',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
