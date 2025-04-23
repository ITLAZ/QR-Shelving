import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductScanPage } from './product-scan.page';

describe('ProductScanPage', () => {
  let component: ProductScanPage;
  let fixture: ComponentFixture<ProductScanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
