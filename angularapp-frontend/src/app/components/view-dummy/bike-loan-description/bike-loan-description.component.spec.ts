import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeLoanDescriptionComponent } from './bike-loan-description.component';

describe('BikeLoanDescriptionComponent', () => {
  let component: BikeLoanDescriptionComponent;
  let fixture: ComponentFixture<BikeLoanDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BikeLoanDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeLoanDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
