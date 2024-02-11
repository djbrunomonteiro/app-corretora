import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAgendamentosComponent } from './list-agendamentos.component';

describe('ListAgendamentosComponent', () => {
  let component: ListAgendamentosComponent;
  let fixture: ComponentFixture<ListAgendamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAgendamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAgendamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
