import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombateBrigComponent } from './combate-brig.component';

describe('CombateBrigComponent', () => {
  let component: CombateBrigComponent;
  let fixture: ComponentFixture<CombateBrigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombateBrigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombateBrigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
