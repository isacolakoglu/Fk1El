import { Component } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { ProductsComponent } from '../../components/products/products/products.component';
@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CarouselComponent, ProductsComponent]
})
export class HomeComponent {}
