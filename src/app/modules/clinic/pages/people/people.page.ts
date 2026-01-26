import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';
import { TabsModule } from 'primeng/tabs';
import { PersonMasterView } from '../../views/person-master/person-master.view';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [
    TabsModule,
    PersonMasterView,
  ],
  templateUrl: './people.page.html',
})
export class PeoplePage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Personas');
  }
}
