import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrigadistaComponent } from './add-brigadista.component';

describe('AddBrigadistaComponent', () => {
  let component: AddBrigadistaComponent;
  let fixture: ComponentFixture<AddBrigadistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBrigadistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrigadistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
