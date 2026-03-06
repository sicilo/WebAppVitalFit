import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ServiceOrderService } from '../../../../core/services/service-order.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ServiceOrder } from '../../../../core/models/service-order.model';

@Component({
  selector: 'app-sales-record',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TableModule, PanelModule, ButtonModule],
  templateUrl: './sales-record.view.html',
})
export class SalesRecordView implements OnInit {
  private readonly serviceOrderService = inject(ServiceOrderService);
  private readonly toastService = inject(ToastService);

  @Output() orderSelected = new EventEmitter<number>();

  protected readonly orders = signal<ServiceOrder[]>([]);
  protected readonly loading = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  onRowClick(order: ServiceOrder): void {
    this.orderSelected.emit(order.consecutive);
  }

  loadOrders(): void {
    this.loading.set(true);
    this.serviceOrderService.getPaged().subscribe({
      next: (response) => {
        this.loading.set(false);
        this.orders.set(response.value?.items ?? []);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Error al cargar el registro de ventas');
      },
    });
  }
}
