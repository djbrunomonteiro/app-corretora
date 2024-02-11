import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDuvidaComponent } from './cliente-duvida.component';

describe('ClienteDuvidaComponent', () => {
  let component: ClienteDuvidaComponent;
  let fixture: ComponentFixture<ClienteDuvidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteDuvidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClienteDuvidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
