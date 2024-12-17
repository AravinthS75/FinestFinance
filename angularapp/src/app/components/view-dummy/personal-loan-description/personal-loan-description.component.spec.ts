import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanDescriptionComponent } from './personal-loan-description.component';

describe('PersonalLoanDescriptionComponent', () => {
  let component: PersonalLoanDescriptionComponent;
  let fixture: ComponentFixture<PersonalLoanDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalLoanDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalLoanDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
