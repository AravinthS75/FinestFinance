import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApplyCarLoanComponent } from './user-apply-car-loan.component';

describe('UserApplyCarLoanComponent', () => {
  let component: UserApplyCarLoanComponent;
  let fixture: ComponentFixture<UserApplyCarLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserApplyCarLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApplyCarLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
