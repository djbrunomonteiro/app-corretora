import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesUltimosComponent } from './slides-ultimos.component';

describe('SlidesUltimosComponent', () => {
  let component: SlidesUltimosComponent;
  let fixture: ComponentFixture<SlidesUltimosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidesUltimosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidesUltimosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
