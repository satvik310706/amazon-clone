import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerOrders } from './dealer-orders';

describe('DealerOrders', () => {
  let component: DealerOrders;
  let fixture: ComponentFixture<DealerOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
