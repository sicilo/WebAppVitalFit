import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { RoleService } from '../../../services/role.service';
import { Permission, RolePermissionUpdate } from '../../../interfaces/role.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-assign-permission',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatExpansionModule
  ],
  templateUrl: './role-assign-permission.component.html',
  styleUrl: './role-assign-permission.component.scss'
})
export class RoleAssignPermissionComponent implements OnInit {
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = false;
  errorMessage = '';
  roleId: string | null = null;
  roleName: string = '';
  
  permissions: Permission[] = [];
  originalPermissions: Permission[] = [];
  permissionGroups: { [key: string]: Permission[] } = {};

  constructor() {
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');

    if (this.roleId) {
      this.loadRole(this.roleId);
      this.loadPermissions(this.roleId);
    } else {
      this.isLoading = false;
    }
  }

  loadRole(id: string): void {
    this.roleService.getById(id).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.roleName = response.value.name;
        }
      },
      error: (error) => {
        console.error('Error al cargar rol:', error);
      }
    });
  }

  loadPermissions(roleId: string): void {
    this.roleService.getPermissions(roleId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.permissions = response.value;
          this.originalPermissions = JSON.parse(JSON.stringify(response.value));
          this.groupPermissions();
        }
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
      }
    });
  }

  groupPermissions(): void {
    this.permissionGroups = {};
    this.permissions.forEach(permission => {
      const group = permission.permissionName.split('.')[0];
      if (!this.permissionGroups[group]) {
        this.permissionGroups[group] = [];
      }
      this.permissionGroups[group].push(permission);
    });
  }

  getGroupKeys(): string[] {
    return Object.keys(this.permissionGroups);
  }

  getActiveCount(group: string): number {
    return this.permissionGroups[group]?.filter(p => p.active).length || 0;
  }

  getGroupLength(group: string): number {
    return this.permissionGroups[group]?.length || 0;
  }

  getPermissionAction(permissionName: string): string {
    return permissionName.split('.')[1] || '';
  }

  togglePermission(permission: Permission): void {
    permission.active = !permission.active;
  }

  onSubmit(): void {
    if (!this.roleId) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    this.updatePermissions();
  }

  updatePermissions(): void {
    const permissionsToAdd: any[] = [];
    const permissionsToRemove: any[] = [];

    this.permissions.forEach((permission, index) => {
      const original = this.originalPermissions[index];
      
      if (permission.active && !original.active) {
        permissionsToAdd.push({
          permissionId: permission.permissionId,
          roleId: permission.roleId
        });
      }
      
      if (!permission.active && original.active) {
        permissionsToRemove.push({
          rolePermissionId: permission.id
        });
      }
    });

    if (permissionsToAdd.length > 0 || permissionsToRemove.length > 0) {
      const updateData: RolePermissionUpdate = {
        permissionsToAdd,
        permissionsToRemove
      };

      this.roleService.updatePermissions(updateData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Permisos actualizados correctamente',
              icon: 'success',
              confirmButtonColor: '#29abe2'
            }).then(() => {
              this.router.navigate(['/dashboard/roles']);
            });
          } else {
            this.errorMessage = 'Error al actualizar permisos';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al actualizar permisos:', error);
          this.errorMessage = error.error?.message || 'Error al actualizar permisos';
        }
      });
    } else {
      this.isLoading = false;
      Swal.fire({
        title: 'Sin cambios',
        text: 'No se detectaron cambios en los permisos',
        icon: 'info',
        confirmButtonColor: '#29abe2'
      }).then(() => {
        this.router.navigate(['/dashboard/roles']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/roles']);
  }
}
