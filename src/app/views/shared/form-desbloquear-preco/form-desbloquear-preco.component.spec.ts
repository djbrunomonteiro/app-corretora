import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDesbloquearPrecoComponent } from './form-desbloquear-preco.component';

describe('FormDesbloquearPrecoComponent', () => {
  let component: FormDesbloquearPrecoComponent;
  let fixture: ComponentFixture<FormDesbloquearPrecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDesbloquearPrecoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDesbloquearPrecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
