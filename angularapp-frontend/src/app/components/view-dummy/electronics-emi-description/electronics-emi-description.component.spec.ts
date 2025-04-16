import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicsEmiDescriptionComponent } from './electronics-emi-description.component';

describe('ElectronicsEmiDescriptionComponent', () => {
  let component: ElectronicsEmiDescriptionComponent;
  let fixture: ComponentFixture<ElectronicsEmiDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectronicsEmiDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectronicsEmiDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
