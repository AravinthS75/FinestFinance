import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewLoanComponent } from './user-view-loan.component';

describe('UserViewLoanComponent', () => {
  let component: UserViewLoanComponent;
  let fixture: ComponentFixture<UserViewLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserViewLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
