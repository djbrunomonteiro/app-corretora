import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientesEditComponent } from './admin-clientes-edit.component';

describe('AdminClientesEditComponent', () => {
  let component: AdminClientesEditComponent;
  let fixture: ComponentFixture<AdminClientesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClientesEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminClientesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
