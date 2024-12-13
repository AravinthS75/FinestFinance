import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAuthGuardComponent } from './no-auth-guard.component';

describe('NoAuthGuardComponent', () => {
  let component: NoAuthGuardComponent;
  let fixture: ComponentFixture<NoAuthGuardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoAuthGuardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAuthGuardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
