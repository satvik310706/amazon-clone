import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DealerService {
    private baseUrl = 'https://amazon-clone-fastapi.onrender.com/dealer';

    private statsCache: any = null;
    private productsCache: any[] | null = null;
    private ordersCache: any[] | null = null;

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('token');
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            })
        };
    }

    /** ✅ Fetch Dealer Stats (with caching) */
    getStats(forceRefresh = false): Observable<any> {
        if (!forceRefresh && this.statsCache) {
            return of(this.statsCache); // return cached value
        }
        return this.http.get(`${this.baseUrl}/stats`, this.getHeaders())
            .pipe(tap(data => this.statsCache = data)); // save in cache
    }

    /** ✅ Fetch Products (with caching) */
    getProducts(forceRefresh = false): Observable<any> {
        if (!forceRefresh && this.productsCache) {
            return of(this.productsCache);
        }
        return this.http.get(`${this.baseUrl}/products`, this.getHeaders())
            .pipe(tap(data => this.productsCache = data as any[]));
    }

    createProduct(product: any) {
        return this.http.post(`${this.baseUrl}/products`, product, this.getHeaders());
    }

    updateProduct(productId: string, updated: any) {
        return this.http.put(`${this.baseUrl}/products/${productId}`, updated, this.getHeaders());
    }

    deleteProduct(productId: string) {
        return this.http.delete(`${this.baseUrl}/products/${productId}`, this.getHeaders());
    }

    /** ✅ Fetch Orders (with caching) */
    getOrders(forceRefresh = false): Observable<any> {
        if (!forceRefresh && this.ordersCache) {
            return of(this.ordersCache);
        }
        return this.http.get(`${this.baseUrl}/orders`, this.getHeaders())
            .pipe(tap(data => this.ordersCache = data as any[]));
    }
}
