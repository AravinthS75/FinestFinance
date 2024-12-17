import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLoanDescriptionComponent } from './business-loan-description.component';

describe('BusinessLoanDescriptionComponent', () => {
  let component: BusinessLoanDescriptionComponent;
  let fixture: ComponentFixture<BusinessLoanDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessLoanDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessLoanDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
