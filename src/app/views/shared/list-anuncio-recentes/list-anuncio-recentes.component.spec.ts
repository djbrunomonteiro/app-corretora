import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAnuncioRecentesComponent } from './list-anuncio-recentes.component';

describe('ListAnuncioRecentesComponent', () => {
  let component: ListAnuncioRecentesComponent;
  let fixture: ComponentFixture<ListAnuncioRecentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAnuncioRecentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAnuncioRecentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
