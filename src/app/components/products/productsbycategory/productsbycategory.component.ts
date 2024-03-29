import { Component, OnInit } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../../services/products/products.service';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PriceformatPipe } from '../../../pipes/priceformat.pipe';

@Component({
  selector: 'app-productsbycategory',
  standalone: true,
  imports: [ProductsComponent, RouterLink, FormsModule, CommonModule, PriceformatPipe],
  templateUrl: './productsbycategory.component.html',
  styleUrl: './productsbycategory.component.css',
})
export class ProductsbycategoryComponent implements OnInit {
  categoryId: any;
  categories: any[] = [];
  categoryName: string = '';
  products: any = [];
  productId: any;
  constructor(private route: ActivatedRoute, private router: Router, private productsService: ProductsService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoryId = params.get('id');
    });
    this.productsByCategory();
  }

  productsByCategory() {
    this.productsService.getCategories().subscribe((categories: any) => {
      this.categories = categories.category;
      console.log(this.categories);
      const category = this.categories.find((cat: any) => cat.id === Number(this.categoryId));
      this.categoryName = category ? category.name : '';
      console.log(this.categoryName);
      this.productsService.getAllProducts().subscribe((productsArrays: any[]) => {
        const allProducts = productsArrays.reduce((acc, curr) => acc.concat(curr), []);
        allProducts.forEach((product: any) => {
          if (Number(product.category_id) === Number(this.categoryId)) {
            this.products.push(product);
          }
        });
      });
    });
  }
}
