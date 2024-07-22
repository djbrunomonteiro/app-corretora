import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPostsComponent } from './grid-posts.component';

describe('GridPostsComponent', () => {
  let component: GridPostsComponent;
  let fixture: ComponentFixture<GridPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridPostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
