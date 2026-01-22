import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RolesService } from '../../../../core/services/roles.service';
import { ToastService } from '../../../../core/services/toast.service';
import { TitleService } from '../../../../core/services/title.service';
import { ManageRolePermissionsRequest, PermissionByRoleView, Role } from '../../../../core/models/role.model';
import { PanelModule } from "primeng/panel";
import { AccordionModule } from 'primeng/accordion';
import { JsonPipe } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    TableModule,
    TagModule,
    TooltipModule,
    PanelModule,
    AccordionModule,
    CheckboxModule,
    FormsModule
  ],
  templateUrl: './roles-permissions.page.html',
})
export class RolesPermissionsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly rolesService = inject(RolesService);
  private readonly toastService = inject(ToastService);
  private readonly titleService = inject(TitleService);

  protected readonly roles = signal<Role[]>([]);
  protected readonly filteredRoles = signal<Role[]>([]);
  protected readonly selectedRole = signal<Role | null>(null);
  protected readonly permissions = signal<PermissionByRoleView[]>([]);

  protected readonly loading = signal(false);
  protected readonly loadingPermissions = signal(false);

  protected readonly roleForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.titleService.setTitle('Roles y Permisos');
    this.loadRoles();
  }

  private loadRoles(): void {
    this.loading.set(true);
    this.rolesService.getAll().subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.roles.set(response.value);
        } else if (response.error) {
          this.showError(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.showError('Error al cargar los roles');
      },
    });
  }

  filterRoles(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    const filtered = this.roles().filter((role) =>
      role.name.toLowerCase().includes(query)
    );
    this.filteredRoles.set(filtered);
  }

  onRoleSelect(event: AutoCompleteSelectEvent): void {
    const role = event.value as Role;
    this.selectedRole.set(role);
    this.roleForm.patchValue({ name: role.name });
    this.loadPermissions(role.id);
  }

  onRoleClear(): void {
    this.selectedRole.set(null);
    this.roleForm.reset();
    this.permissions.set([]);
  }

  private loadPermissions(roleId: string): void {
    this.loadingPermissions.set(true);
    this.rolesService.getPermissions(roleId).subscribe({
      next: (response) => {
        this.loadingPermissions.set(false);
        if (response.value) {

          const permissionsByRole = new Map<string, PermissionByRoleView>();

          for (const p of response.value) {
            const [roleName, actionName] = p.permissionName.split('.');

            const action = {
              actionId: p.id,
              permissionId: p.permissionId,
              actionName,
              active: p.active,
            };

            const permission =
              permissionsByRole.get(roleName) ??
              (() => {
                const created: PermissionByRoleView = {
                  roleName,
                  actions: [],
                };
                permissionsByRole.set(roleName, created);
                return created;
              })();

            permission.actions.push(action);
          }

          this.permissions.set([...permissionsByRole.values()]);

        } else if (response.error) {
          this.showError(response.error.message);
        }
      },
      error: () => {
        this.loadingPermissions.set(false);
        this.showError('Error al cargar los permisos');
      },
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const name = this.roleForm.getRawValue().name;
    const selected = this.selectedRole();

    if (selected) {
      this.rolesService.update({ id: selected.id, name }).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.value) {
            this.showSuccess('Rol actualizado exitosamente');
            this.loadRoles();
            this.selectedRole.set({
              id: selected.id,
              name: name,
              createdAt: selected.createdAt,
              updatedAt: new Date().toISOString()
            });
          } else if (response.error) {
            this.showError(response.error.message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.showError('Error al actualizar el rol');
        },
      });
    } else {
      this.rolesService.create({ name }).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.value) {
            this.showSuccess('Rol creado exitosamente');
            this.loadRoles();
            this.selectedRole.set({
              id: response.value,
              name: name,
              createdAt: new Date().toISOString()
            });
            this.loadPermissions(response.value);
          } else if (response.error) {
            this.showError(response.error.message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.showError('Error al crear el rol');
        },
      });
    }
  }

  savePermissions(): void {
    this.loading.set(true);
    const permissions = this.permissions().map(p => p.actions).flat();

    const selected = permissions.filter(p => p.active);
    const deselected = permissions.filter(p => !p.active && p.actionId != '00000000-0000-0000-0000-000000000000');

    const request: ManageRolePermissionsRequest = {
      permissionsToAdd: selected.map(p => ({ permissionId: p.permissionId, roleId: this.selectedRole()!.id })),
      permissionsToRemove: deselected.map(p => ({ rolePermissionId: p.actionId })),
    };

    this.rolesService.updatePermissions(request).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.showSuccess('Permisos actualizados exitosamente');
        } else if (response.error) {
          this.showError(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.showError('Error al actualizar los permisos');
      },
    });
  }

  private showSuccess(message: string): void {
    this.toastService.success(message);
  }

  private showError(message: string): void {
    this.toastService.error(message);
  }

  getActiveCountText(permission: PermissionByRoleView): string {
    return `${permission.actions.filter(a => a.active).length} / ${permission.actions.length}`;
  }

  get isEditMode(): boolean {
    return this.selectedRole() !== null;
  }
}
