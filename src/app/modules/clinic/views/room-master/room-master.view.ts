import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { RoomService } from '../../../../core/services/room.service';
import { RoomTypeService } from '../../../../core/services/room-type.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Room } from '../../../../core/models/room.model';
import { RoomType } from '../../../../core/models/room-type.model';

@Component({
  selector: 'app-room-master',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    TableModule,
    PanelModule,
    TooltipModule,
  ],
  templateUrl: './room-master.view.html',
})
export class RoomMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly roomService = inject(RoomService);
  private readonly roomTypeService = inject(RoomTypeService);
  private readonly toastService = inject(ToastService);

  protected readonly rooms = signal<Room[]>([]);
  protected readonly roomTypes = signal<RoomType[]>([]);
  protected readonly selectedRoom = signal<Room | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);
  protected readonly totalRecords = signal(0);
  protected readonly rows = signal(10);
  protected readonly first = signal(0);

  protected readonly form = this.fb.nonNullable.group({
    roomTypeId: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.loadRoomTypes();
    this.loadRooms();
  }

  protected loadRoomTypes(): void {
    this.roomTypeService.getAll().subscribe({
      next: (response) => {
        if (response.value) {
          this.roomTypes.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los tipos de cabina');
      },
    });
  }

  private loadRooms(): void {
    this.loadingTable.set(true);
    this.roomService.getPaged({
      page: Math.floor(this.first() / this.rows()) + 1,
      itemsPerPage: this.rows(),
    }).subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.rooms.set(response.value.items);
          this.totalRecords.set(response.value.totalCount);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar las cabinas');
      },
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadRooms();
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<Room>): void {
    const room = selectionEvent.data;
    if (!room || Array.isArray(room)) return;

    this.selectedRoom.set(room);
    this.form.patchValue({
      roomTypeId: room.roomTypeId,
      name: room.name,
      description: room.description ?? '',
    });
  }

  onClear(): void {
    this.selectedRoom.set(null);
    this.form.reset({ roomTypeId: '', name: '', description: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedRoom();

    if (selected) {
      this.roomService.update({
        id: selected.id,
        roomTypeId: formValue.roomTypeId,
        name: formValue.name,
        description: formValue.description,
      }).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.value) {
            this.toastService.success('Cabina actualizada exitosamente');
            this.loadRooms();
            this.onClear();
          } else if (response.error) {
            this.toastService.error(response.error.message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Error al actualizar la cabina');
        },
      });
    } else {
      this.roomService.create({
        roomTypeId: formValue.roomTypeId,
        name: formValue.name,
        description: formValue.description,
      }).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.value) {
            this.toastService.success('Cabina creada exitosamente');
            this.loadRooms();
            this.onClear();
          } else if (response.error) {
            this.toastService.error(response.error.message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.toastService.error('Error al crear la cabina');
        },
      });
    }
  }

  onDelete(): void {
    const selected = this.selectedRoom();
    if (!selected) return;

    this.loading.set(true);
    this.roomService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Cabina eliminada exitosamente');
          this.loadRooms();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar la cabina');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedRoom() !== null;
  }
}
