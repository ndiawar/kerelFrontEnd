import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocageModalComponent } from './blocage-modal.component';

describe('BlocageModalComponent', () => {
  let component: BlocageModalComponent;
  let fixture: ComponentFixture<BlocageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocageModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
