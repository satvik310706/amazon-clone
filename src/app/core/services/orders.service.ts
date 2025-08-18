import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private baseUrl = 'https://amazon-clone-fastapi.onrender.com/orders';

    constructor(private http: HttpClient) { }

    getMyOrders() {
        const token = localStorage.getItem('token');
        console.log("Using token:", token);
        return this.http.get(`${this.baseUrl}/my-orders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }


    placeOrder() {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
        return this.http.post(`${this.baseUrl}/place`, {}, { headers });
    }
}
