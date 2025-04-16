import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicsEmiComponent } from './electronics-emi.component';

describe('ElectronicsEmiComponent', () => {
  let component: ElectronicsEmiComponent;
  let fixture: ComponentFixture<ElectronicsEmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectronicsEmiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectronicsEmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
