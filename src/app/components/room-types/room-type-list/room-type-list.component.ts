import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RoomTypeService } from '../../../services/room-type.service';
import { RoomType } from '../../../interfaces/room-type.interface';
import Swal from 'sweetalert2';
import { RoomTypeFormComponent } from '../room-type-form/room-type-form.component';

@Component({
  selector: 'app-room-type-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './room-type-list.component.html',
  styleUrl: './room-type-list.component.scss',
})
export class RoomTypeListComponent implements OnInit {
  private roomTypeService = inject(RoomTypeService);
  private dialog = inject(MatDialog);

  roomTypes: RoomType[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'name',
    'description',
    'actions',
  ];

  ngOnInit(): void {
    this.loadRoomTypes();
  }

  loadRoomTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.roomTypeService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.roomTypes = response.value;
        } else {
          this.errorMessage =
            response.error?.message || 'Error al cargar tipos de sala';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar tipos de sala';
      },
    });
  }

  createRoomType(): void {
    const dialogRef = this.dialog.open(RoomTypeFormComponent, {
      width: '600px',
      data: { roomType: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRoomTypes();
      }
    });
  }

  editRoomType(roomType: RoomType): void {
    const dialogRef = this.dialog.open(RoomTypeFormComponent, {
      width: '600px',
      data: { roomType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRoomTypes();
      }
    });
  }

  confirmDelete(roomType: RoomType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de sala ${roomType.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && roomType.id) {
        this.deleteRoomType(roomType.id);
      }
    });
  }

  deleteRoomType(roomTypeId: string): void {
    this.roomTypeService.delete(roomTypeId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El tipo de sala ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          this.loadRoomTypes();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el tipo de sala',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar tipo de sala:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el tipo de sala',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }
}
