import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerViewLoanComponent } from './manager-view-loan.component';

describe('ManagerViewLoanComponent', () => {
  let component: ManagerViewLoanComponent;
  let fixture: ComponentFixture<ManagerViewLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerViewLoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerViewLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
