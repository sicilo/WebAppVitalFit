import { Component, inject, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.titleService.setTitle('Ventas');
  }
}
