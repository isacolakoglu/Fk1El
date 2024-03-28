import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products/products.service';
import { CommonModule } from '@angular/common';
import { flatMap, reduce, concat, pipe, tap, filter, merge, map } from 'rxjs';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  imageData: any = []; // Resim URL'leri
  categories: any[] = [];
  productsByCategory: any = [];
  products: any = [];
  categoryId: any;

  constructor(private productsService: ProductsService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.allData();
    this.route.paramMap.subscribe((params) => {
      this.categoryId = params.get('id');
    });
  }

  allData() {
    this.productsService.getAllProducts().subscribe((productsArrays: any[]) => {
      const allProducts = productsArrays.reduce((acc, curr) => acc.concat(curr), []);
      // console.log(allProducts); //  [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]

      this.productsService.getCategories().subscribe((categoriesData: any) => {
        this.categories = categoriesData.category;
        // console.log(this.categories); // [{…}, {…}, {…}, {…}]
        this.groupProductsByCategory(allProducts);
      });
    });
  }

  groupProductsByCategory(allProducts: any[]) {
    this.productsByCategory = {};

    allProducts.forEach((product) => {
      const categoryName = this.getCategoryNameById(product.category_id);
      if (!this.productsByCategory[categoryName]) {
        this.productsByCategory[categoryName] = [];
      }
      this.productsByCategory[categoryName].push(product);
    });
  }

  getCategoryNameById(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    // console.log(category);
    return category ? category.name : 'Kategori Yok';
  }
}
