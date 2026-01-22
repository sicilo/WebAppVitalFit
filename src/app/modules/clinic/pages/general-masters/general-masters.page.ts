import { Component, inject, OnInit } from '@angular/core';
import { TitleService } from '../../../../core/services/title.service';
import { TabsModule } from 'primeng/tabs';
import { IdentificationTypeMasterView } from '../../views/identification-type-master/identification-type-master.view';
import { BloodTypeMasterView } from '../../views/blood-type-master/blood-type-master.view';
import { GenderMasterView } from '../../views/gender-master/gender-master.view';
import { JobTitleMasterView } from '../../views/job-title-master/job-title-master.view';
import { RoomTypeMasterView } from '../../views/room-type-master/room-type-master.view';

@Component({
  selector: 'app-general-masters',
  standalone: true,
  imports: [
    TabsModule,
    IdentificationTypeMasterView,
    BloodTypeMasterView,
    GenderMasterView,
    JobTitleMasterView,
    RoomTypeMasterView,
  ],
  templateUrl: './general-masters.page.html',
})
export class GeneralMastersPage implements OnInit {
  private readonly titleService = inject(TitleService);

  ngOnInit(): void {
    this.titleService.setTitle('Maestros Generales');
  }
}
