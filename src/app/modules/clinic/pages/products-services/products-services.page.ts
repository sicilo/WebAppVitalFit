import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';
import { TabsModule } from 'primeng/tabs';
import { ItemMasterView } from '../../views/item-master/item-master.view';
import { BundleConfigurationView } from '../../views/bundle-configuration/bundle-configuration.view';

@Component({
  selector: 'app-products-services',
  standalone: true,
  imports: [
    TabsModule,
    ItemMasterView,
    BundleConfigurationView,
  ],
  templateUrl: './products-services.page.html',
})
export class ProductsServicesPage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Productos y Servicios');
  }
}
