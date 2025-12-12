import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Utilisateurlist } from './utilisateurlist';

describe('Utilisateurlist', () => {
  let component: Utilisateurlist;
  let fixture: ComponentFixture<Utilisateurlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Utilisateurlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Utilisateurlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
