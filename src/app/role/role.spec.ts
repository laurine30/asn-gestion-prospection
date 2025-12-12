import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleComponent } from './role.component'; // ← Correction du nom d'import

describe('RoleComponent', () => { // ← Correction du nom
  let component: RoleComponent; // ← Correction du type
  let fixture: ComponentFixture<RoleComponent>; // ← Correction du type

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleComponent] // ← OK car standalone
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});