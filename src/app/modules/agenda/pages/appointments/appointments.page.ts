import { Component, inject, OnInit, signal } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TitleService } from '../../../../core/services/title.service';
import { SalesRevenueView } from '../../views/sales-revenue/sales-revenue.view';
import { SalesRecordView } from '../../views/sales-record/sales-record.view';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [TabsModule, SalesRevenueView, SalesRecordView],
  templateUrl: './appointments.page.html',
})
export class AppointmentsPage implements OnInit {
  private readonly titleService = inject(TitleService);

  protected readonly activeTab = signal<string>('record');

  ngOnInit(): void {
    this.titleService.setTitle('Citas');
  }

  onTabChange(value: string | number | undefined): void {
    this.activeTab.set(value?.toString() ?? 'record');
  }
}
