import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobTitleService } from '../../../services/job-title.service';
import { JobTitle } from '../../../interfaces/job-title.interface';
import { JobTitleFormComponent } from '../job-title-form/job-title-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-title-list',
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
  templateUrl: './job-title-list.component.html',
  styleUrl: './job-title-list.component.scss'
})
export class JobTitleListComponent implements OnInit {
  private jobTitleService = inject(JobTitleService);
  private dialog = inject(MatDialog);

  jobTitles: JobTitle[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['name', 'description', 'actions'];

  ngOnInit(): void {
    this.loadJobTitles();
  }

  loadJobTitles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.jobTitleService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.jobTitles = response.value;
        } else {
          this.errorMessage = response.error?.message || 'Error al cargar cargos';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar cargos';
      }
    });
  }

  createJobTitle(): void {
    const dialogRef = this.dialog.open(JobTitleFormComponent, {
      width: '600px',
      data: { jobTitle: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadJobTitles();
      }
    });
  }

  editJobTitle(jobTitle: JobTitle): void {
    const dialogRef = this.dialog.open(JobTitleFormComponent, {
      width: '600px',
      data: { jobTitle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadJobTitles();
      }
    });
  }

  confirmDelete(jobTitle: JobTitle): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el cargo ${jobTitle.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && jobTitle.id) {
        this.deleteJobTitle(jobTitle.id);
      }
    });
  }

  deleteJobTitle(jobTitleId: string): void {
    this.jobTitleService.delete(jobTitleId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El cargo ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadJobTitles();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el cargo',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar cargo:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el cargo',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
