import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLoanActionComponent } from './manager-loan-action.component';

describe('ManagerLoanActionComponent', () => {
  let component: ManagerLoanActionComponent;
  let fixture: ComponentFixture<ManagerLoanActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerLoanActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerLoanActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
