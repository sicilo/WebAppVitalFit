import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';
import { TabsModule } from 'primeng/tabs';
import { ServiceMasterView } from '../../views/service-master/service-master.view';
import { ProductMasterView } from '../../views/product-master/product-master.view';

@Component({
  selector: 'app-products-services',
  standalone: true,
  imports: [
    TabsModule,
    ServiceMasterView,
    ProductMasterView,
  ],
  templateUrl: './products-services.page.html',
})
export class ProductsServicesPage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Productos y Servicios');
  }
}
