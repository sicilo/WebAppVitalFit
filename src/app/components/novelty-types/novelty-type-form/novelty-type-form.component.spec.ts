import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoveltyTypeFormComponent } from './novelty-type-form.component';

describe('NoveltyTypeFormComponent', () => {
  let component: NoveltyTypeFormComponent;
  let fixture: ComponentFixture<NoveltyTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoveltyTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoveltyTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
