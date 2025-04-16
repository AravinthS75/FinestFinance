import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarLoanDescriptionComponent } from './car-loan-description.component';

describe('CarLoanDescriptionComponent', () => {
  let component: CarLoanDescriptionComponent;
  let fixture: ComponentFixture<CarLoanDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarLoanDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarLoanDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
