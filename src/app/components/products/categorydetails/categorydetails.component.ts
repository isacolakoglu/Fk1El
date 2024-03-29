import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ProductsService } from '../../../services/products/products.service';
import { PriceformatPipe } from '../../../pipes/priceformat.pipe';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-categorydetails',
  standalone: true,
  imports: [RouterLink, PriceformatPipe, CommonModule, PriceformatPipe],
  templateUrl: './categorydetails.component.html',
  styleUrl: './categorydetails.component.css',
})
export class CategorydetailsComponent implements OnInit {
  categoryBack: any;
  productId: any;
  product: any = [];
  constructor(private route: ActivatedRoute, private router: Router, private productsService: ProductsService) {}
  ngOnInit(): void {
    this.categoryBack = +this.route.snapshot.paramMap.get('id')!;
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
    });
    this.getProductId();
  }

  getProductId() {
    this.productsService.getAllProducts().subscribe((productsArrays: any[]) => {
      const allProducts = productsArrays.reduce((acc, curr) => acc.concat(curr), []);
      allProducts.forEach((product: any) => {
        if (Number(product.id) === Number(this.productId)) {
          this.product.push(product);
        }
      });
      console.log(this.product);
    });
  }

  like() {
    console.log('Hello');
  }
}
