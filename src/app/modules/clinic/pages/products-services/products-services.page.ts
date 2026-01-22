import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';

@Component({
  selector: 'app-products-services',
  standalone: true,
  imports: [],
  templateUrl: './products-services.page.html',
})
export class ProductsServicesPage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Productos y Servicios');
  }
}
