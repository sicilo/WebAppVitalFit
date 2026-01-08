import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTypeFormComponent } from './employee-type-form.component';

describe('EmployeeTypeFormComponent', () => {
  let component: EmployeeTypeFormComponent;
  let fixture: ComponentFixture<EmployeeTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
