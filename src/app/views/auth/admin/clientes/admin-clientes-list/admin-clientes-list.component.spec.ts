import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientesListComponent } from './admin-clientes-list.component';

describe('AdminClientesListComponent', () => {
  let component: AdminClientesListComponent;
  let fixture: ComponentFixture<AdminClientesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClientesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminClientesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
