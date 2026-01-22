import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-general-masters',
  standalone: true,
  imports: [
    TabsModule
  ],
  templateUrl: './general-masters.page.html',
})
export class GeneralMastersPage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Maestros Generales');
  }
}
