import { Component, inject, OnInit, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TitleService } from '../../../../core/services/title.service';
import { SalesRevenueView } from '../../views/sales-revenue/sales-revenue.view';
import { SalesRecordView } from '../../views/sales-record/sales-record.view';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [TabsModule, SalesRevenueView, SalesRecordView],
  templateUrl: './sales.page.html',
})
export class SalesPage implements OnInit {
  private readonly titleService = inject(TitleService);

  protected readonly activeTab = signal<string>('record');
  protected readonly orderSelection = signal<{ consecutive: number; ts: number } | null>(null);

  ngOnInit(): void {
    this.titleService.setTitle('Ventas');
  }

  onTabChange(value: string | number | undefined): void {
    this.activeTab.set(value?.toString() ?? 'record');
  }

  onOrderSelected(consecutive: number): void {
    this.orderSelection.set({ consecutive, ts: Date.now() });
    this.activeTab.set('revenue');
  }
}
