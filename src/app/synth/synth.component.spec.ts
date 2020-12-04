import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthComponent } from './synth.component';

describe('SynthComponent', () => {
  let component: SynthComponent;
  let fixture: ComponentFixture<SynthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
