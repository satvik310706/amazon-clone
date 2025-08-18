import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private baseUrl = 'https://amazon-clone-fastapi.onrender.com/cart';

    constructor(private http: HttpClient) { }

    private getToken(): string | null {
        return localStorage.getItem('token');
    }

    private getHeaders() {
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this.getToken()}`,
                'Content-Type': 'application/json'
            })
        };
    }

    addItem(productId: string, quantity: number = 1) {
        const payload = { product_id: productId, quantity };
        return this.http.post(`${this.baseUrl}/add`, payload, this.getHeaders());
    }

    getCart() {
        return this.http.get<any>(`${this.baseUrl}/`, this.getHeaders());
    }

    removeItem(productId: string) {
        return this.http.delete(`${this.baseUrl}/${productId}`, this.getHeaders());
    }

    updateItem(productId: string, quantity: number) {
        const payload = { product_id: productId, quantity };
        return this.http.put(`${this.baseUrl}/update`, payload, this.getHeaders());
    }

    checkoutCart() {
        return this.http.post(`https://amazon-clone-fastapi.onrender.com/orders/place`, {}, this.getHeaders());
    }
}
