import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeadsComponent } from './admin-leads.component';

describe('AdminLeadsComponent', () => {
  let component: AdminLeadsComponent;
  let fixture: ComponentFixture<AdminLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
