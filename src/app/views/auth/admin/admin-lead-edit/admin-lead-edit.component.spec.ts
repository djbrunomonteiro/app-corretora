import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeadEditComponent } from './admin-lead-edit.component';

describe('AdminLeadEditComponent', () => {
  let component: AdminLeadEditComponent;
  let fixture: ComponentFixture<AdminLeadEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLeadEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminLeadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
