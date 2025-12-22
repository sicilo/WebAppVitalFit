import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../../services/role.service';
import { UserCreate, UserUpdate } from '../../../interfaces/user.interface';
import { Role } from '../../../interfaces/role.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isEditMode = false;
  userId: string | null = null;
  showPassword = false;

  roles: Role[] = [];

  constructor() {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: [true, [Validators.required]],
      roleId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      // En modo edición, la contraseña es opcional
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.loadUser(this.userId);
    }
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.roles = response.value;
        }
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.userService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          const user = response.value;
          this.userForm.patchValue({
            userName: user.userName,
            email: user.email,
            status: user.status,
            roleId: user.roleId
          });
        } else {
          this.errorMessage = 'Error al cargar usuario';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar usuario:', error);
        this.errorMessage = error.error?.message || 'Error al cargar usuario';
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.userId) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser(): void {
    const userData: UserCreate = this.userForm.value;

    this.userService.create(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario creado correctamente',
            icon: 'success',
            confirmButtonColor: '#29abe2'
          }).then(() => {
            this.router.navigate(['/dashboard/users']);
          });
        } else {
          this.errorMessage = response.error?.message || 'Error al crear usuario';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al crear usuario:', error);
        this.errorMessage = error.error?.message || 'Error al crear usuario';
      }
    });
  }

  updateUser(): void {
    if (!this.userId) return;

    const userData: UserUpdate = {
      id: this.userId,
      ...this.userForm.value
    };

    // Si no se ingresó una nueva contraseña, no la enviamos
    if (!userData.password) {
      delete userData.password;
    }

    this.userService.update(this.userId, userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario actualizado correctamente',
            icon: 'success',
            confirmButtonColor: '#29abe2'
          }).then(() => {
            this.router.navigate(['/dashboard/users']);
          });
        } else {
          this.errorMessage = response.error?.message || 'Error al actualizar usuario';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar usuario:', error);
        this.errorMessage = error.error?.message || 'Error al actualizar usuario';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/users']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get userName() {
    return this.userForm.get('userName');
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get status() {
    return this.userForm.get('status');
  }

  get roleId() {
    return this.userForm.get('roleId');
  }
}
