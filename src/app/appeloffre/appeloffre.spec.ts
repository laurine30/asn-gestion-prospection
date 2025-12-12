import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppeloffreComponent } from './appeloffre';

describe('AppeloffreComponent', () => {
  let component: AppeloffreComponent;
  let fixture: ComponentFixture<AppeloffreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppeloffreComponent] // composant standalone = dans imports
    }).compileComponents();

    fixture = TestBed.createComponent(AppeloffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
