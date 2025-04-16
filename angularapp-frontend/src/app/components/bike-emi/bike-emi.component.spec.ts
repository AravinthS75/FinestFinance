import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeEmiComponent } from './bike-emi.component';

describe('BikeEmiComponent', () => {
  let component: BikeEmiComponent;
  let fixture: ComponentFixture<BikeEmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BikeEmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeEmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
