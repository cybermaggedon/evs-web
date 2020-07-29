import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllThreatsComponent } from './all-threats.component';

describe('AllThreatsComponent', () => {
  let component: AllThreatsComponent;
  let fixture: ComponentFixture<AllThreatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllThreatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllThreatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
