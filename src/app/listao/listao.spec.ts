import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listao } from './listao';

describe('Listao', () => {
  let component: Listao;
  let fixture: ComponentFixture<Listao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
