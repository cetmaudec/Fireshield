import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadobrigadistaComponent } from './estadobrigadista.component';

describe('EstadobrigadistaComponent', () => {
  let component: EstadobrigadistaComponent;
  let fixture: ComponentFixture<EstadobrigadistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadobrigadistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadobrigadistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
