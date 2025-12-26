import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AcquisitionChannelService } from '../../../services/acquisition-channel.service';
import { AcquisitionChannel } from '../../../interfaces/acquisition-channel.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acquisition-channel-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './acquisition-channel-form.component.html',
  styleUrl: './acquisition-channel-form.component.scss'
})
export class AcquisitionChannelFormComponent {
  private dialogRef = inject(MatDialogRef<AcquisitionChannelFormComponent>);
  private acquisitionChannelService = inject(AcquisitionChannelService);
  private fb = inject(FormBuilder);
  
  channel: AcquisitionChannel | null;
  channelForm: FormGroup;
  isLoading = false;
  isEditMode: boolean;

  channelTypes = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'web', label: 'Sitio Web' },
    { value: 'referido', label: 'Referido' },
    { value: 'otro', label: 'Otro' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { channel: AcquisitionChannel | null }) {
    this.channel = data.channel;
    this.isEditMode = !!this.channel;
    this.channelForm = this.fb.group({
      name: [this.channel?.name || '', [Validators.required, Validators.minLength(3)]],
      type: [this.channel?.type || '', [Validators.required]],
      description: [this.channel?.description || '']
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.channelForm.invalid) {
      this.channelForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.channel?.id) {
      const channelData: AcquisitionChannel = {
        id: this.channel.id,
        ...this.channelForm.value
      };

      this.acquisitionChannelService.update(this.channel.id, channelData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Canal actualizado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al actualizar canal',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al actualizar canal',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    } else {
      this.acquisitionChannelService.create(this.channelForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.isSuccess) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Canal creado correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close(true);
          } else {
            Swal.fire({
              title: 'Error',
              text: response.error?.message || 'Error al crear canal',
              icon: 'error',
              confirmButtonColor: '#dc2626'
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'Error al crear canal',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  }
}
