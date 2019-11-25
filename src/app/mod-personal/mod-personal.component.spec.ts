import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModPersonalComponent } from './mod-personal.component';

describe('ModPersonalComponent', () => {
  let component: ModPersonalComponent;
  let fixture: ComponentFixture<ModPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
