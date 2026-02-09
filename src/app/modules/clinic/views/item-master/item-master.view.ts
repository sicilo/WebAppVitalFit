import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { ItemService } from '../../../../core/services/item.service';
import { ItemTypeService } from '../../../../core/services/item-type.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Item } from '../../../../core/models/item.model';
import { ItemType } from '../../../../core/models/item-type.model';

@Component({
  selector: 'app-item-master',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    SelectModule,
    TableModule,
    PanelModule,
    TooltipModule,
  ],
  templateUrl: './item-master.view.html',
})
export class ItemMasterView implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly itemService = inject(ItemService);
  private readonly itemTypeService = inject(ItemTypeService);
  private readonly toastService = inject(ToastService);
  private itemTypeChangeSub!: Subscription;

  protected readonly items = signal<Item[]>([]);
  protected readonly itemTypes = signal<ItemType[]>([]);
  protected readonly selectedItem = signal<Item | null>(null);
  protected readonly isServiceType = signal(false);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);
  protected readonly totalRecords = signal(0);
  protected readonly rows = signal(10);
  protected readonly first = signal(0);

  protected readonly form = this.fb.nonNullable.group({
    itemTypeId: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    minimumSessions: [null as number | null],
    duration: [null as number | null],
    validity: [null as number | null],
  });

  ngOnInit(): void {
    this.loadItemTypes();
    this.loadItems();
    this.itemTypeChangeSub = this.form.controls.itemTypeId.valueChanges.subscribe(
      (itemTypeId) => this.updateServiceTypeFlag(itemTypeId)
    );
  }

  ngOnDestroy(): void {
    this.itemTypeChangeSub?.unsubscribe();
  }

  private updateServiceTypeFlag(itemTypeId: string): void {
    const itemType = this.itemTypes().find((t) => t.id === itemTypeId);
    this.isServiceType.set(itemType?.name === 'Servicio');
  }

  private timeSpanToMinutes(timeSpan: string | null): number | null {
    if (!timeSpan) return null;
    const parts = timeSpan.split(':');
    if (parts.length < 2) return null;
    let hours = 0;
    let minutes = 0;
    const dayPart = parts[0].split('.');
    if (dayPart.length === 2) {
      hours = parseInt(dayPart[1], 10);
      minutes = parseInt(parts[1], 10);
      const days = parseInt(dayPart[0], 10);
      return days * 24 * 60 + hours * 60 + minutes;
    }
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    return hours * 60 + minutes;
  }

  private minutesToTimeSpan(totalMinutes: number | null): string | null {
    if (totalMinutes == null) return null;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }

  private timeSpanToDays(timeSpan: string | null): number | null {
    if (!timeSpan) return null;
    const dayPart = timeSpan.split('.')[0].split(':')[0];
    if (timeSpan.includes('.')) {
      return parseInt(timeSpan.split('.')[0], 10);
    }
    const hours = parseInt(dayPart, 10);
    return Math.floor(hours / 24);
  }

  private daysToTimeSpan(days: number | null): string | null {
    if (days == null) return null;
    return `${days}.00:00:00`;
  }

  private loadItemTypes(): void {
    this.itemTypeService.getAll().subscribe({
      next: (response) => {
        if (response.value) {
          this.itemTypes.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.toastService.error('Error al cargar los tipos de artículo');
      },
    });
  }

  private loadItems(): void {
    this.loadingTable.set(true);
    this.itemService.getPaged({
      page: Math.floor(this.first() / this.rows()) + 1,
      itemsPerPage: this.rows(),
    }).subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.items.set(response.value.items);
          this.totalRecords.set(response.value.totalCount);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los productos y servicios');
      },
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);
    this.loadItems();
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<Item>): void {
    const item = selectionEvent.data;

    if (!item || Array.isArray(item)) {
      return;
    }

    this.selectedItem.set(item);
    this.updateServiceTypeFlag(item.itemTypeId);
    this.form.patchValue({
      itemTypeId: item.itemTypeId,
      name: item.name,
      description: item.description ?? '',
      price: item.price ?? 0,
      minimumSessions: item.minimumSessions ?? null,
      duration: this.timeSpanToMinutes(item.duration),
      validity: this.timeSpanToDays(item.validity),
    });
  }

  onClear(): void {
    this.selectedItem.set(null);
    this.isServiceType.set(false);
    this.form.reset({ itemTypeId: '', name: '', description: '', price: 0, minimumSessions: null, duration: null, validity: null });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedItem();

    if (selected) {
      this.itemService
        .update({
          id: selected.id,
          itemTypeId: formValue.itemTypeId,
          name: formValue.name,
          description: formValue.description,
          price: formValue.price,
          isService: this.isServiceType(),
          ...(this.isServiceType() ? {
            minimumSessions: formValue.minimumSessions,
            duration: this.minutesToTimeSpan(formValue.duration),
            validity: this.daysToTimeSpan(formValue.validity),
          } : {}),
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Producto/Servicio actualizado exitosamente');
              this.loadItems();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el producto/servicio');
          },
        });
    } else {
      this.itemService
        .create({
          itemTypeId: formValue.itemTypeId,
          name: formValue.name,
          description: formValue.description,
          price: formValue.price,
          isService: this.isServiceType(),
          ...(this.isServiceType() ? {
            minimumSessions: formValue.minimumSessions,
            duration: this.minutesToTimeSpan(formValue.duration),
            validity: this.daysToTimeSpan(formValue.validity),
          } : {}),
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Producto/Servicio creado exitosamente');
              this.loadItems();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el producto/servicio');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedItem();
    if (!selected) return;

    this.loading.set(true);
    this.itemService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Producto/Servicio eliminado exitosamente');
          this.loadItems();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el producto/servicio');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedItem() !== null;
  }
}
