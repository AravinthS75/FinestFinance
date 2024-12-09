import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewLoansComponent } from './admin-view-loans.component';

describe('AdminViewLoansComponent', () => {
  let component: AdminViewLoansComponent;
  let fixture: ComponentFixture<AdminViewLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminViewLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
