import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModBrigadaComponent } from './mod-brigada.component';

describe('ModBrigadaComponent', () => {
  let component: ModBrigadaComponent;
  let fixture: ComponentFixture<ModBrigadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModBrigadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModBrigadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
