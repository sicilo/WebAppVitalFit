import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { ItemTypeService } from '../../../../core/services/item-type.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ItemType } from '../../../../core/models/item-type.model';

@Component({
  selector: 'app-item-type-master',
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
  templateUrl: './item-type-master.view.html',
})
export class ItemTypeMasterView implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly itemTypeService = inject(ItemTypeService);
  private readonly toastService = inject(ToastService);

  protected readonly itemTypes = signal<ItemType[]>([]);
  protected readonly selectedItemType = signal<ItemType | null>(null);
  protected readonly loading = signal(false);
  protected readonly loadingTable = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.loadItemTypes();
  }

  private loadItemTypes(): void {
    this.loadingTable.set(true);
    this.itemTypeService.getAll().subscribe({
      next: (response) => {
        this.loadingTable.set(false);
        if (response.value) {
          this.itemTypes.set(response.value);
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loadingTable.set(false);
        this.toastService.error('Error al cargar los tipos de artículo');
      },
    });
  }

  onRowSelect(selectionEvent: TableRowSelectEvent<ItemType>): void {
    const itemType = selectionEvent.data;

    if (!itemType || Array.isArray(itemType)) {
      return;
    }

    this.selectedItemType.set(itemType);
    this.form.patchValue({
      name: itemType.name,
      description: itemType.description ?? '',
    });
  }

  onClear(): void {
    this.selectedItemType.set(null);
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.getRawValue();
    const selected = this.selectedItemType();

    if (selected) {
      this.itemTypeService
        .update({
          id: selected.id,
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Tipo de artículo actualizado exitosamente');
              this.loadItemTypes();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al actualizar el tipo de artículo');
          },
        });
    } else {
      this.itemTypeService
        .create({
          name: formValue.name,
          description: formValue.description,
        })
        .subscribe({
          next: (response) => {
            this.loading.set(false);
            if (response.value) {
              this.toastService.success('Tipo de artículo creado exitosamente');
              this.loadItemTypes();
              this.onClear();
            } else if (response.error) {
              this.toastService.error(response.error.message);
            }
          },
          error: () => {
            this.loading.set(false);
            this.toastService.error('Error al crear el tipo de artículo');
          },
        });
    }
  }

  onDelete(): void {
    const selected = this.selectedItemType();
    if (!selected) return;

    this.loading.set(true);
    this.itemTypeService.delete(selected.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.value) {
          this.toastService.success('Tipo de artículo eliminado exitosamente');
          this.loadItemTypes();
          this.onClear();
        } else if (response.error) {
          this.toastService.error(response.error.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al eliminar el tipo de artículo');
      },
    });
  }

  get isEditMode(): boolean {
    return this.selectedItemType() !== null;
  }
}
