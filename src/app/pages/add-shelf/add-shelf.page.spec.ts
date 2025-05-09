import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddShelfPage } from './add-shelf.page';

describe('AddShelfPage', () => {
  let component: AddShelfPage;
  let fixture: ComponentFixture<AddShelfPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShelfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
