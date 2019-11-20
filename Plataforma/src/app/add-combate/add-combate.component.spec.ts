import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCombateComponent } from './add-combate.component';

describe('AddCombateComponent', () => {
  let component: AddCombateComponent;
  let fixture: ComponentFixture<AddCombateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCombateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCombateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
