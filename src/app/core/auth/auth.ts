import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
}
@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl = 'https://amazon-clone-fastapi.onrender.com';
  private http = inject(HttpClient)
  private router = inject(Router)
  constructor() { }
  login(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }
  signup(userData: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }


  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  getUserRole(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role');
    }
    return null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/login';
    }
  }

  getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded ? decoded.id : null;
  }
}
