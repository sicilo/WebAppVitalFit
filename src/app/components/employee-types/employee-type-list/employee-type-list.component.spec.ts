import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeListComponent } from './employee-type-list.component';

describe('EmployeeTypeListComponent', () => {
  let component: EmployeeTypeListComponent;
  let fixture: ComponentFixture<EmployeeTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
