import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerViewUsersComponent } from './manager-view-users.component';

describe('ManagerViewUsersComponent', () => {
  let component: ManagerViewUsersComponent;
  let fixture: ComponentFixture<ManagerViewUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerViewUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerViewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
