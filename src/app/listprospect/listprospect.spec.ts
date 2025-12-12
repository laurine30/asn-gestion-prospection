import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listprospect } from './listprospect';

describe('Listprospect', () => {
  let component: Listprospect;
  let fixture: ComponentFixture<Listprospect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listprospect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listprospect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
