import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeEmiDescriptionComponent } from './bike-emi-description.component';

describe('BikeEmiDescriptionComponent', () => {
  let component: BikeEmiDescriptionComponent;
  let fixture: ComponentFixture<BikeEmiDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BikeEmiDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeEmiDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
