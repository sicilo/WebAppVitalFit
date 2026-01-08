import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeTypeService } from '../../../services/employee-type.service';
import { EmployeeType } from '../../../interfaces/employee-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './employee-type-form.component.html',
  styleUrl: './employee-type-form.component.scss'
})
export class EmployeeTypeFormComponent {
  private dialogRef = inject(MatDialogRef<EmployeeTypeFormComponent>);
  private employeeTypeService = inject(EmployeeTypeService);
  private fb = inject(FormBuilder);
  
  employeeType: EmployeeType | null;
  employeeTypeForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { employeeType: EmployeeType | null }) {
    this.employeeType = data.employeeType;
    this.isEditMode = !!this.employeeType;
    this.employeeTypeForm = this.fb.group({
      name: [this.employeeType?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.employeeType?.description || '', [Validators.required]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.employeeTypeForm.invalid) {
      this.employeeTypeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.employeeTypeForm.getRawValue();

    if (this.isEditMode && this.employeeType?.id) {
      const employeeTypeData: EmployeeType = {
        id: this.employeeType.id,
        ...formValue
      };

      this.employeeTypeService.update(this.employeeType.id, employeeTypeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de empleado actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar tipo de empleado',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar tipo de empleado',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.employeeTypeService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de empleado creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear tipo de empleado',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear tipo de empleado',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
