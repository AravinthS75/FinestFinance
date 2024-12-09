import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApplyBusinessLoanComponent } from './user-apply-business-loan.component';

describe('UserApplyBusinessLoanComponent', () => {
  let component: UserApplyBusinessLoanComponent;
  let fixture: ComponentFixture<UserApplyBusinessLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserApplyBusinessLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApplyBusinessLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
