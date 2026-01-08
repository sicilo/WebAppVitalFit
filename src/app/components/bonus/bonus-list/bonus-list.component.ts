import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BonusService } from '../../../services/bonus.service';
import { Bonus } from '../../../interfaces/bonus.interface';
import Swal from 'sweetalert2';
import { BonusFormComponent } from '../bonus-form/bonus-form.component';

@Component({
  selector: 'app-bonus-list',
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
  templateUrl: './bonus-list.component.html',
  styleUrl: './bonus-list.component.scss',
})
export class BonusListComponent implements OnInit {
  private bonusService = inject(BonusService);
  private dialog = inject(MatDialog);

  bonuses: Bonus[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = [
    'name',
    'sessions',
    'price',
    'description',
    'actions',
  ];

  ngOnInit(): void {
    this.loadBonuses();
  }

  loadBonuses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bonusService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.bonuses = response.value;
        } else {
          this.errorMessage =
            response.error?.message || 'Error al cargar bonos';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al cargar bonos';
      },
    });
  }

  createBonus(): void {
    const dialogRef = this.dialog.open(BonusFormComponent, {
      width: '600px',
      data: { bonus: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBonuses();
      }
    });
  }

  editBonus(bonus: Bonus): void {
    const dialogRef = this.dialog.open(BonusFormComponent, {
      width: '600px',
      data: { bonus },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBonuses();
      }
    });
  }

  confirmDelete(bonus: Bonus): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el bono ${bonus.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed && bonus.id) {
        this.deleteBonus(bonus.id);
      }
    });
  }

  deleteBonus(bonusId: string): void {
    this.bonusService.delete(bonusId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El bono ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981',
          });
          this.loadBonuses();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el bono',
            icon: 'error',
            confirmButtonColor: '#dc2626',
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar bono:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el bono',
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }
}
