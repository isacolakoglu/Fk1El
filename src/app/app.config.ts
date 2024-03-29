import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { PriceformatPipe } from './pipes/priceformat.pipe';
import { CategorydetailsComponent } from './components/products/categorydetails/categorydetails.component';
// import { AuthGuard } from './guards/auth/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), PriceformatPipe],
};
