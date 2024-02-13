import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerVenderHomeComponent } from './banner-vender-home.component';

describe('BannerVenderHomeComponent', () => {
  let component: BannerVenderHomeComponent;
  let fixture: ComponentFixture<BannerVenderHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerVenderHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannerVenderHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
