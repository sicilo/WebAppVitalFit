import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class ItemMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly itemService = inject(ItemService);
  private readonly itemTypeService = inject(ItemTypeService);
  private readonly toastService = inject(ToastService);

  protected readonly items = signal<Item[]>([]);
  protected readonly itemTypes = signal<ItemType[]>([]);
  protected readonly selectedItem = signal<Item | null>(null);
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
  });

  ngOnInit(): void {
    this.loadItemTypes();
    this.loadItems();
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
    this.form.patchValue({
      itemTypeId: item.itemTypeId,
      name: item.name,
      description: item.description ?? '',
      price: item.price ?? 0,
    });
  }

  onClear(): void {
    this.selectedItem.set(null);
    this.form.reset({ itemTypeId: '', name: '', description: '', price: 0 });
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
