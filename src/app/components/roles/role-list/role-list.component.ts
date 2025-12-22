import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../interfaces/role.interface';
import { RoleFormComponent } from '../role-form/role-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent implements OnInit {
  private roleService = inject(RoleService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  roles: Role[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'actions'];

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.roleService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.roles = response.value;
        } else {
          this.errorMessage = 'Error al cargar roles';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar roles:', error);
        this.errorMessage = error.error?.message || 'Error al cargar roles';
      }
    });
  }

  createRole(): void {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      width: '500px',
      data: { role: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  editRole(role: Role): void {
    const dialogRef = this.dialog.open(RoleFormComponent, {
      width: '500px',
      data: { role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRoles();
      }
    });
  }

  managePermissions(role: Role): void {
    this.router.navigate(['/dashboard/roles/permissions', role.id]);
  }

  confirmDelete(role: Role): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Deseas eliminar el rol ${role.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRole(role.id);
      }
    });
  }

  deleteRole(roleId: string): void {
    this.roleService.delete(roleId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El rol ha sido eliminado correctamente.',
            icon: 'success',
            confirmButtonColor: '#29abe2',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadRoles();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el rol',
            icon: 'error',
            confirmButtonColor: '#29abe2'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar rol:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'Error al eliminar rol',
          icon: 'error',
          confirmButtonColor: '#29abe2'
        });
      }
    });
  }

  getStatusText(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }
}
