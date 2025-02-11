import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDeleteComponent } from './multiple-delete.component';

describe('MultipleDeleteComponent', () => {
  let component: MultipleDeleteComponent;
  let fixture: ComponentFixture<MultipleDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
