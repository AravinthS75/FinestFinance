import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditProfileComponent } from './user-edit-profile.component';

describe('UserEditProfileComponent', () => {
  let component: UserEditProfileComponent;
  let fixture: ComponentFixture<UserEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserEditProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
