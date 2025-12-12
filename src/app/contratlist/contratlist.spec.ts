import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratListComponent } from './contratlist';


describe('Contratlist', () => {
  let component: ContratListComponent;
  let fixture: ComponentFixture<ContratListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContratListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
