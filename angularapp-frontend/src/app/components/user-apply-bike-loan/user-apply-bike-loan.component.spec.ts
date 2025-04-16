import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApplyBikeLoanComponent } from './user-apply-bike-loan.component';

describe('UserApplyBikeLoanComponent', () => {
  let component: UserApplyBikeLoanComponent;
  let fixture: ComponentFixture<UserApplyBikeLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserApplyBikeLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApplyBikeLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
