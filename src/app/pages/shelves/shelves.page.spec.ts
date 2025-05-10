import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShelvesPage } from './shelves.page';

describe('ShelvesPage', () => {
  let component: ShelvesPage;
  let fixture: ComponentFixture<ShelvesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelvesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
