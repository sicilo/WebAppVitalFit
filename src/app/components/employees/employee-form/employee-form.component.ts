import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../interfaces/employee.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-form',
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
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent {
  private dialogRef = inject(MatDialogRef<EmployeeFormComponent>);
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);
  
  employee: Employee | null;
  employeeForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  roles = [
    { value: 'esteticista', label: 'Esteticista' },
    { value: 'medico', label: 'Médico' },
    { value: 'auxiliar', label: 'Auxiliar' },
    { value: 'otro', label: 'Otro' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { employee: Employee | null }) {
    this.employee = data.employee;
    this.isEditMode = !!this.employee;
    this.employeeForm = this.fb.group({
      firstName: [this.employee?.firstName || '', [Validators.required, Validators.minLength(2)]],
      lastName: [this.employee?.lastName || '', [Validators.required, Validators.minLength(2)]],
      documentType: [this.employee?.documentType || ''],
      documentNumber: [this.employee?.documentNumber || ''],
      role: [this.employee?.role || '', [Validators.required]],
      phone: [this.employee?.phone || ''],
      email: [this.employee?.email || '', [Validators.email]],
      specialization: [this.employee?.specialization || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.employee?.id) {
      const employeeData: Employee = {
        id: this.employee.id,
        ...this.employeeForm.value
      };

      this.employeeService.update(this.employee.id, employeeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Empleado actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar empleado',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar empleado',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.employeeService.create(this.employeeForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Empleado creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear empleado',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear empleado',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
