import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPostListComponent } from './admin-post-list.component';

describe('AdminPostListComponent', () => {
  let component: AdminPostListComponent;
  let fixture: ComponentFixture<AdminPostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPostListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
