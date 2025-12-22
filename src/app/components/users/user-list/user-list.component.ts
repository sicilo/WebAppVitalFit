import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['userName', 'email', 'roleName', 'status', 'actions'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.users = response.value;
        } else {
          this.errorMessage = 'Error al cargar usuarios';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar usuarios:', error);
        this.errorMessage = error.error?.message || 'Error al cargar usuarios';
      }
    });
  }

  createUser(): void {
    this.router.navigate(['dashboard/users/create']);
  }

  editUser(user: User): void {
    this.router.navigate(['dashboard/users/edit', user.id]);
  }

  confirmDelete(user: User): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Deseas eliminar al usuario ${user.userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(userId: string): void {
    this.userService.delete(userId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El usuario ha sido eliminado correctamente.',
            icon: 'success',
            confirmButtonColor: '#29abe2',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadUsers();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el usuario',
            icon: 'error',
            confirmButtonColor: '#29abe2'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'Error al eliminar usuario',
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
