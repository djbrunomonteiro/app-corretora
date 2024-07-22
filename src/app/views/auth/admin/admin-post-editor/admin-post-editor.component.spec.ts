import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPostEditorComponent } from './admin-post-editor.component';

describe('AdminPostEditorComponent', () => {
  let component: AdminPostEditorComponent;
  let fixture: ComponentFixture<AdminPostEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPostEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPostEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
