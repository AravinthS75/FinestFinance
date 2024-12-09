import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApplyPersonalLoanComponent } from './user-apply-personal-loan.component';

describe('UserApplyPersonalLoanComponent', () => {
  let component: UserApplyPersonalLoanComponent;
  let fixture: ComponentFixture<UserApplyPersonalLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserApplyPersonalLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApplyPersonalLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
