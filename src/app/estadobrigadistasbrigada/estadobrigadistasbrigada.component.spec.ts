import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadobrigadistasbrigadaComponent } from './estadobrigadistasbrigada.component';

describe('EstadobrigadistasbrigadaComponent', () => {
  let component: EstadobrigadistasbrigadaComponent;
  let fixture: ComponentFixture<EstadobrigadistasbrigadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadobrigadistasbrigadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadobrigadistasbrigadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
