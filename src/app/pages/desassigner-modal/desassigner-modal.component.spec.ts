import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesassignerModalComponent } from './desassigner-modal.component';

describe('DesassignerModalComponent', () => {
  let component: DesassignerModalComponent;
  let fixture: ComponentFixture<DesassignerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesassignerModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesassignerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
