import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AcquisitionChannelService } from '../../../services/acquisition-channel.service';
import { AcquisitionChannel } from '../../../interfaces/acquisition-channel.interface';
import { AcquisitionChannelFormComponent } from '../acquisition-channel-form/acquisition-channel-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acquisition-channel-list',
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
  templateUrl: './acquisition-channel-list.component.html',
  styleUrl: './acquisition-channel-list.component.scss'
})
export class AcquisitionChannelListComponent implements OnInit {
  private acquisitionChannelService = inject(AcquisitionChannelService);
  private dialog = inject(MatDialog);

  channels: AcquisitionChannel[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'type', 'description', 'actions'];

  ngOnInit(): void {
    this.loadChannels();
  }

  loadChannels(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.acquisitionChannelService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.channels = response.value;
        } else {
          this.errorMessage = 'Error al cargar canales de adquisición';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar canales:', error);
        this.errorMessage = error.error?.message || 'Error al cargar canales de adquisición';
      }
    });
  }

  createChannel(): void {
    const dialogRef = this.dialog.open(AcquisitionChannelFormComponent, {
      width: '600px',
      data: { channel: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChannels();
      }
    });
  }

  editChannel(channel: AcquisitionChannel): void {
    const dialogRef = this.dialog.open(AcquisitionChannelFormComponent, {
      width: '600px',
      data: { channel }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChannels();
      }
    });
  }

  confirmDelete(channel: AcquisitionChannel): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el canal ${channel.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && channel.id) {
        this.deleteChannel(channel.id);
      }
    });
  }

  deleteChannel(channelId: number): void {
    this.acquisitionChannelService.delete(channelId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'Canal eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadChannels();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el canal',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar canal:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el canal',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'instagram': 'Instagram',
      'facebook': 'Facebook',
      'web': 'Sitio Web',
      'referido': 'Referido',
      'otro': 'Otro'
    };
    return labels[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'instagram': 'accent',
      'facebook': 'primary',
      'web': 'warn',
      'referido': '',
      'otro': ''
    };
    return colors[type] || '';
  }
}
