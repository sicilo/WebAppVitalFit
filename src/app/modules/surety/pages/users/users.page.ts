import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { TitleService } from '../../../../core/services/title.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UserService } from '../../../../core/services/user.service';
import { RolesService } from '../../../../core/services/roles.service';
import { User } from '../../../../core/models/user.model';
import { Role } from '../../../../core/models/role.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    TableModule,
    PanelModule,
    TooltipModule,
    TagModule,
  ],
  templateUrl: './users.page.html',
})
export class UsersPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly titleService = inject(TitleService);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);
  private readonly rolesService = inject(RolesService);

  protected readonly users = signal<User[]>([]);
  protected readonly roles = signal<Role[]>([]);
  protected readonly selectedUser = signal<User | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);
  protected readonly togglingUserId = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      roleId: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit(): void {
    this.titleService.setTitle('Usuarios');
    this.loadUsers();
    this.loadRoles();
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private loadUsers(): void {
    this.loadingTable.set(true);
    this.userService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.users.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los usuarios');
      },
    });
  }

  private loadRoles(): void {
    this.rolesService.getAll().subscribe({
      next: (response) => {
        if (response.value) {
          this.roles.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los roles');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<User>): void {
    const user = selectionEvent.data;

    if (!user || Array.isArray(user)) {
      return;
    }

    this.selectedUser.set(user);
    this.form.patchValue({
      userName: user.userName,
      email: user.email,
      password: '',
      confirmPassword: '',
      roleId: user.roleId,
    });

    // In edit mode, password is optional
    this.form.controls.password.clearValidators();
    this.form.controls.confirmPassword.clearValidators();
    this.form.controls.password.updateValueAndValidity();
    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  onClear(): void {
    this.selectedUser.set(null);
    this.form.reset({ userName: '', email: '', password: '', confirmPassword: '', roleId: '' });

    // Restore validators for create mode
    this.form.controls.password.setValidators(Validators.required);
    this.form.controls.confirmPassword.setValidators(Validators.required);
    this.form.controls.password.updateValueAndValidity();
    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Check password match when password is provided
    const formValue = this.form.getRawValue();
    if (formValue.password && formValue.password !== formValue.confirmPassword) {
      this.toastService.error('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    const selected = this.selectedUser();

    if (selected) {
      this.userService
        .update({
          id: selected.id,
          userName: formValue.userName,
          email: formValue.email,
          password: formValue.password || undefined,
          roleId: formValue.roleId,
          status: selected.status
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Usuario actualizado exitosamente');
              this.loadUsers();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el usuario');
          },
        });
    } else {
      this.userService
        .create({
          userName: formValue.userName,
          email: formValue.email,
          password: formValue.password,
          roleId: formValue.roleId,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Usuario creado exitosamente');
              this.loadUsers();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el usuario');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedUser();
    if (!selected) return;

    this.loading.set(true);
    this.userService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Usuario eliminado exitosamente');
          this.loadUsers();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el usuario');
      },
    });
  }

  onToggleStatus(user: User, event: Event): void {
    event.stopPropagation();
    this.togglingUserId.set(user.id);

    this.userService
      .update({
        ...user,
        status: !user.status,
      })
      .subscribe({
        next: (response) => {
          this.togglingUserId.set(null);
          if (response.value) {
            const newStatus = !user.status;
            this.toastService.success(
              newStatus ? 'Usuario activado exitosamente' : 'Usuario desactivado exitosamente'
            );
            this.loadUsers();
          } else if (response.error) {
            this.toastService.error(response.error.message);
          }
        },
        error: () => {
          this.togglingUserId.set(null);
          this.toastService.error('Error al cambiar el estado del usuario');
        },
      });
  }

  get isEditMode(): boolean {
    return this.selectedUser() !== null;
  }
}
