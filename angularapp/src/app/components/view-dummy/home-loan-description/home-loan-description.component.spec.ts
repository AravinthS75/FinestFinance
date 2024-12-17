import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanDescriptionComponent } from './home-loan-description.component';

describe('HomeLoanDescriptionComponent', () => {
  let component: HomeLoanDescriptionComponent;
  let fixture: ComponentFixture<HomeLoanDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeLoanDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeLoanDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
