import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModCombateComponent } from './mod-combate.component';

describe('ModCombateComponent', () => {
  let component: ModCombateComponent;
  let fixture: ComponentFixture<ModCombateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModCombateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModCombateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
