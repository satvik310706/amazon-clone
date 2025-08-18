import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth } from '../auth/auth';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private auth: Auth, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const allowedRoles = route.data['roles'] as Array<string>;
        const userRole = this.auth.getUserRole();

        if (userRole && allowedRoles.includes(userRole)) {
            return true;
        }

        this.router.navigate(['/unauthorized']); // Create this page later
        return false;
    }
}
