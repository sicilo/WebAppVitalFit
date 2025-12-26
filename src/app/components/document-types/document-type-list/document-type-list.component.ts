import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentTypeService } from '../../../services/document-type.service';
import { DocumentType } from '../../../interfaces/document-type.interface';
import { DocumentTypeFormComponent } from '../document-type-form/document-type-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-type-list',
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
  templateUrl: './document-type-list.component.html',
  styleUrl: './document-type-list.component.scss'
})
export class DocumentTypeListComponent implements OnInit {
  private documentTypeService = inject(DocumentTypeService);
  private dialog = inject(MatDialog);

  documentTypes: DocumentType[] = [];
  isLoading = false;
  errorMessage = '';
  displayedColumns: string[] = ['code', 'name', 'description', 'actions'];

  ngOnInit(): void {
    this.loadDocumentTypes();
  }

  loadDocumentTypes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.documentTypeService.getAll().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.documentTypes = response.value;
        } else {
          this.errorMessage = 'Error al cargar tipos de documento';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar tipos de documento:', error);
        this.errorMessage = error.error?.message || 'Error al cargar tipos de documento';
      }
    });
  }

  createDocumentType(): void {
    const dialogRef = this.dialog.open(DocumentTypeFormComponent, {
      width: '600px',
      data: { documentType: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDocumentTypes();
      }
    });
  }

  editDocumentType(documentType: DocumentType): void {
    const dialogRef = this.dialog.open(DocumentTypeFormComponent, {
      width: '600px',
      data: { documentType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDocumentTypes();
      }
    });
  }

  confirmDelete(documentType: DocumentType): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el tipo de documento ${documentType.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed && documentType.id) {
        this.deleteDocumentType(documentType.id);
      }
    });
  }

  deleteDocumentType(documentTypeId: number): void {
    this.documentTypeService.delete(documentTypeId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El tipo de documento ha sido eliminado exitosamente',
            icon: 'success',
            confirmButtonColor: '#10b981'
          });
          this.loadDocumentTypes();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el tipo de documento',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar tipo de documento:', error);
        Swal.fire({
          title: 'Error',
          text: error.error?.message || 'No se pudo eliminar el tipo de documento',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    });
  }
}
