import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DocumentTypeService } from '../../../services/document-type.service';
import { DocumentType } from '../../../interfaces/document-type.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './document-type-form.component.html',
  styleUrl: './document-type-form.component.scss'
})
export class DocumentTypeFormComponent {
  private dialogRef = inject(MatDialogRef<DocumentTypeFormComponent>);
  private documentTypeService = inject(DocumentTypeService);
  private fb = inject(FormBuilder);
  
  documentType: DocumentType | null;
  documentTypeForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { documentType: DocumentType | null }) {
    this.documentType = data.documentType;
    this.isEditMode = !!this.documentType;
    this.documentTypeForm = this.fb.group({
      code: [
        { value: this.documentType?.code || '', disabled: this.isEditMode },
        [Validators.required, Validators.minLength(2), Validators.maxLength(10)]
      ],
      name: [this.documentType?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.documentType?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.documentTypeForm.invalid) {
      this.documentTypeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Get raw value to include disabled fields
    const formValue = this.documentTypeForm.getRawValue();

    if (this.isEditMode && this.documentType?.id) {
      const documentTypeData: DocumentType = {
        id: this.documentType.id,
        ...formValue
      };

      this.documentTypeService.update(this.documentType.id, documentTypeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de documento actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar tipo de documento',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar tipo de documento',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.documentTypeService.create(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tipo de documento creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear tipo de documento',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear tipo de documento',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
