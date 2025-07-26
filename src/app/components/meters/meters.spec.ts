import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Meters } from './meters';

describe('Meters', () => {
  let component: Meters;
  let fixture: ComponentFixture<Meters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Meters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Meters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
