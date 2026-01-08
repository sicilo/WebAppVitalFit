import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoveltyTypeListComponent } from './novelty-type-list.component';

describe('NoveltyTypeListComponent', () => {
  let component: NoveltyTypeListComponent;
  let fixture: ComponentFixture<NoveltyTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoveltyTypeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoveltyTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
