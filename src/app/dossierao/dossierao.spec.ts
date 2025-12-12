import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dossierao } from './dossierao';

describe('Dossierao', () => {
  let component: Dossierao;
  let fixture: ComponentFixture<Dossierao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dossierao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dossierao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
