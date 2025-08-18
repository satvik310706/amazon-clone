// dealer.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DealerService {
    private baseUrl = 'https://amazon-clone-fastapi.onrender.com/dealer';

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

    getStats() {
        return this.http.get(`${this.baseUrl}/stats`, this.getHeaders());
    }

    getProducts() {
        return this.http.get(`${this.baseUrl}/products`, this.getHeaders());
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

    getOrders() {
        return this.http.get(`${this.baseUrl}/orders`, this.getHeaders());
    }
}
