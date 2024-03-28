import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, forkJoin, map, tap, throwError, flatMap, switchMap, mergeMap, concatMap, of, from, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // Categories
  private categoriesUrl = 'https://assign-api.piton.com.tr/api/rest/categories';
  // Product
  private productUrl = 'https://assign-api.piton.com.tr/api/rest/products';
  // Product Cover Image
  private coverImageUrl = 'https://assign-api.piton.com.tr/api/rest/cover_image'; // POST {\n    \"fileName\":\"dune.png\"\n}
  // Product Like
  private likeUrl = 'https://assign-api.piton.com.tr/api/rest/like'; // POST {\n    \"user_id\":2,\n    \"product_id\":3\n}
  // Product Unlike
  private unlikeUrl = 'https://assign-api.piton.com.tr/api/rest/unlike'; // POST  {\n    \"user_id\":2,\n    \"product_id\":3\n}

  categories: any[] = [];
  productsByCategory: any = [];

  constructor(private http: HttpClient, private route: Router) {}

  getAllProducts(): Observable<any[]> {
    let allProducts: any[] = [];
    return this.getCategories().pipe(
      concatMap((categoriesData: any) => {
        this.categories = categoriesData.category;
        return forkJoin(
          this.categories.map((category) =>
            this.getProductsByCategoryId(category.id).pipe(
              concatMap((productsResponse: any) => {
                const products = productsResponse.product;
                return forkJoin(
                  products.map((product: any) =>
                    this.getCoversImage(product.id).pipe(
                      concatMap((covers: any[]) => {
                        return this.getImagesUrl(covers).pipe(
                          map((imageUrls: string[]) => {
                            product.imageUrls = imageUrls;
                            product.category_id = category.id;
                            return product;
                          }),
                        );
                      }),
                    ),
                  ),
                );
              }),
            ),
          ),
        ).pipe(map((productsList: any[]) => productsList.sort((a, b) => a.id - b.id)));
      }),
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.categoriesUrl);
  }

  getProductsByCategoryId(categoryId: number[]): Observable<any[]> {
    return this.http.get<any[]>(this.productUrl + '/' + `${categoryId}`);
  }

  // Tüm ürünlerin içindeki cover'i aldığım gibi burada POST ile forkJoin yöntemiyle bütün cover'ları gönderdim karşılığında
  // karşılığında aynı anda URL'leri aldım.
  getImagesUrl(fileName: string[]): Observable<string[]> {
    const requests: Observable<any>[] = [];
    fileName.forEach((fileName) => {
      const request = this.http.post(this.coverImageUrl, { fileName });
      requests.push(request);
    });
    return forkJoin(requests).pipe(
      map((responses: any[]) => {
        const imageUrls: string[] = [];
        responses.forEach((response) => {
          if (response && response.action_product_image.url) {
            imageUrls.push(response.action_product_image.url);
          }
        });
        return imageUrls;
      }),
    );
  }

  // Tüm ürünleri çağırıp içindeki sadece cover'ları aldım.
  getCoversImage(productId: string): Observable<any[]> {
    return this.collectorAllProduct().pipe(
      map((data: any[]) => {
        let coverData = data
          .map((item: any) => item.product)
          .flat()
          .filter((product: any) => product.cover && productId === product.id)
          .map((coverData: any) => coverData.cover);
        return coverData;
      }),
    );
  }

  // Tüm ürünleri çağırıp bir araya getirme yöntemi
  collectorAllProduct(): Observable<any[]> {
    const productUrls: any[] = [];
    for (let i = 1; i <= 4; i++) {
      productUrls.push(this.productUrl + `/${i}`);
    }
    const requests = productUrls.map((url) => this.http.get(url));
    return forkJoin(requests);
  }
}
