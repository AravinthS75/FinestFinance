import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPayEmiComponent } from './user-pay-emi.component';

describe('UserPayEmiComponent', () => {
  let component: UserPayEmiComponent;
  let fixture: ComponentFixture<UserPayEmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPayEmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPayEmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
