import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { RoomTypeService } from '../../../../core/services/room-type.service';
import { ToastService } from '../../../../core/services/toast.service';
import { RoomType } from '../../../../core/models/room-type.model';

@Component({
  selector: 'app-room-type-master',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TableModule,
    PanelModule,
    TooltipModule,
  ],
  templateUrl: './room-type-master.view.html',
})
export class RoomTypeMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly roomTypeService = inject(RoomTypeService);
  private readonly toastService = inject(ToastService);

  protected readonly roomTypes = signal<RoomType[]>([]);
  protected readonly selectedRoomType = signal<RoomType | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.loadRoomTypes();
  }

  private loadRoomTypes(): void {
    this.loadingTable.set(true);
    this.roomTypeService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.roomTypes.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los tipos de sala');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<RoomType>): void {
    const roomType = selectionEvent.data;

    if (!roomType || Array.isArray(roomType)) {
      return;
    }

    this.selectedRoomType.set(roomType);
    this.form.patchValue({
      name: roomType.name,
      description: roomType.description ?? '',
    });
  }

  onClear(): void {
    this.selectedRoomType.set(null);
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedRoomType();

    if (selected) {
      this.roomTypeService
        .update({
          id: selected.id,
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Tipo de sala actualizado exitosamente');
              this.loadRoomTypes();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el tipo de sala');
          },
        });
    } else {
      this.roomTypeService
        .create({
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Tipo de sala creado exitosamente');
              this.loadRoomTypes();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el tipo de sala');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedRoomType();
    if (!selected) return;

    this.loading.set(true);
    this.roomTypeService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Tipo de sala eliminado exitosamente');
          this.loadRoomTypes();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el tipo de sala');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedRoomType() !== null;
  }
}
