import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesHomeComponent } from './slides-home.component';

describe('SlidesHomeComponent', () => {
  let component: SlidesHomeComponent;
  let fixture: ComponentFixture<SlidesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidesHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
