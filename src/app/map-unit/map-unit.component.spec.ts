import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapUnitComponent } from './map-unit.component';

describe('MapUnitComponent', () => {
  let component: MapUnitComponent;
  let fixture: ComponentFixture<MapUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
