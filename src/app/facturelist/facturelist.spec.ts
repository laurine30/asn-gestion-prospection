import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Facturelist } from './facturelist';

describe('Facturelist', () => {
  let component: Facturelist;
  let fixture: ComponentFixture<Facturelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Facturelist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Facturelist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
