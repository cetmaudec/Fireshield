import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModBrigadistaComponent } from './mod-brigadista.component';

describe('ModBrigadistaComponent', () => {
  let component: ModBrigadistaComponent;
  let fixture: ComponentFixture<ModBrigadistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModBrigadistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModBrigadistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
