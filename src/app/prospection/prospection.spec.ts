import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prospection } from './prospection';

describe('Prospection', () => {
  let component: Prospection;
  let fixture: ComponentFixture<Prospection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prospection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prospection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
