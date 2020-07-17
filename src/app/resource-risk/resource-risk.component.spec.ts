import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceRiskComponent } from './resource-risk.component';

describe('ResourceRiskComponent', () => {
  let component: ResourceRiskComponent;
  let fixture: ComponentFixture<ResourceRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
