import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeTypeService } from '../../../services/employee-type.service';
import { EmployeeType } from '../../../interfaces/employee-type.interface';
import { EmployeeTypeFormComponent } from '../employee-type-form/employee-type-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-type-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './employee-type-list.component.html',
  styleUrl: './employee-type-list.component.scss'
})
export class EmployeeTypeListComponent implements OnInit {
  private employeeTypeService = inject(EmployeeTypeService);
  private dialog = inject(MatDialog);

  employeeTypes: EmployeeType[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'description', 'actions'];

  ngOnInit(): void {
    this.loadEmployeeTypes();
  }

  loadEmployeeTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeTypeService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.employeeTypes = response.value;
        } else {
          this.errorMessage = response.error?.message || 'Error al cargar tipos de empleado';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar tipos de empleado';
      }
    });
  }

  createEmployeeType(): void {
    const dialogRef = this.dialog.open(EmployeeTypeFormComponent, {
      width: '600px',
      data: { employeeType: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployeeTypes();
      }
    });
  }

  editEmployeeType(employeeType: EmployeeType): void {
    const dialogRef = this.dialog.open(EmployeeTypeFormComponent, {
      width: '600px',
      data: { employeeType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployeeTypes();
      }
    });
  }

  confirmDelete(employeeType: EmployeeType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de empleado ${employeeType.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && employeeType.id) {
        this.deleteEmployeeType(employeeType.id);
      }
    });
  }

  deleteEmployeeType(employeeTypeId: string): void {
    this.employeeTypeService.delete(employeeTypeId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El tipo de empleado ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadEmployeeTypes();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el tipo de empleado',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar tipo de empleado:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el tipo de empleado',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
