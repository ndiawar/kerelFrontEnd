import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginKerelEcoComponent } from './login-kerel-eco.component';

describe('LoginKerelEcoComponent', () => {
  let component: LoginKerelEcoComponent;
  let fixture: ComponentFixture<LoginKerelEcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginKerelEcoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginKerelEcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
