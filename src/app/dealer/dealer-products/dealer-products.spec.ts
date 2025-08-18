import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerProducts } from './dealer-products';

describe('DealerProducts', () => {
  let component: DealerProducts;
  let fixture: ComponentFixture<DealerProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
