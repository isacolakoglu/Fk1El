import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsbycategoryComponent } from './productsbycategory.component';

describe('ProductsbycategoryComponent', () => {
  let component: ProductsbycategoryComponent;
  let fixture: ComponentFixture<ProductsbycategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsbycategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsbycategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
