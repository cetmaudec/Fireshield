import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrigadaComponent } from './add-brigada.component';

describe('AddBrigadaComponent', () => {
  let component: AddBrigadaComponent;
  let fixture: ComponentFixture<AddBrigadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBrigadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrigadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
