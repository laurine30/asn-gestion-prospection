import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateProspectionComponent } from './valider';

describe('Valider', () => {
  let component: ValidateProspectionComponent;
  let fixture: ComponentFixture<ValidateProspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateProspectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateProspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
