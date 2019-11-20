import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnirseCombateComponent } from './unirse-combate.component';

describe('UnirseCombateComponent', () => {
  let component: UnirseCombateComponent;
  let fixture: ComponentFixture<UnirseCombateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnirseCombateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnirseCombateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
