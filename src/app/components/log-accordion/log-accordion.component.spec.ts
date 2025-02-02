import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogAccordionComponent } from './log-accordion.component';

describe('LogAccordionComponent', () => {
  let component: LogAccordionComponent;
  let fixture: ComponentFixture<LogAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
