import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApplyHomeLoanComponent } from './user-apply-home-loan.component';

describe('UserApplyHomeLoanComponent', () => {
  let component: UserApplyHomeLoanComponent;
  let fixture: ComponentFixture<UserApplyHomeLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserApplyHomeLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApplyHomeLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
