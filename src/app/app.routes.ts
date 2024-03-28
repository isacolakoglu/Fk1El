import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './components/products/products/products.component';
import { ProductsbycategoryComponent } from './components/products/productsbycategory/productsbycategory.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: 'category/:id',
    component: ProductsbycategoryComponent,
  },
];
