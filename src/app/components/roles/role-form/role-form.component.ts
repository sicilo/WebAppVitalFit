import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RoleService } from '../../../services/role.service';
import { Role, RoleUpdate } from '../../../interfaces/role.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss'
})
export class RoleFormComponent {
  private dialogRef = inject(MatDialogRef<RoleFormComponent>);
  private roleService = inject(RoleService);
  private fb = inject(FormBuilder);
  
  role: Role | null;
  roleForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { role: Role | null }) {
    this.role = data.role;
    this.isEditMode = !!this.role;
    this.roleForm = this.fb.group({
      name: [this.role?.name || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.role) {
      const roleData: RoleUpdate = {
        id: this.role.id,
        ...this.roleForm.value
      };

      this.roleService.update(this.role.id, roleData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Rol actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#29abe2',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar rol',
              icon: 'error',
              confirmButtonColor: '#29abe2'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar rol',
            icon: 'error',
            confirmButtonColor: '#29abe2'
          });
        }
      });
    } else {
      this.roleService.create(this.roleForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Rol creado correctamente',
              icon: 'success',
              confirmButtonColor: '#29abe2',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear rol',
              icon: 'error',
              confirmButtonColor: '#29abe2'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear rol',
            icon: 'error',
            confirmButtonColor: '#29abe2'
          });
        }
      });
    }
  }

  get name() {
    return this.roleForm.get('name');
  }
}
