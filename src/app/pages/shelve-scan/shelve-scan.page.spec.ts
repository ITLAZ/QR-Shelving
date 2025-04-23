import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShelveScanPage } from './shelve-scan.page';

describe('ShelveScanPage', () => {
  let component: ShelveScanPage;
  let fixture: ComponentFixture<ShelveScanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelveScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
