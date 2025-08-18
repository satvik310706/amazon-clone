import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Layout } from './layout/layout/layout';
import { Orders } from './orders/orders/orders';
import { DealerProducts } from './dealer/dealer-products/dealer-products';
import { Profile } from './profile/profile';
import { Dashboard } from './dealer/dashboard/dashboard';
import { DealerOrders } from './dealer/dealer-orders/dealer-orders';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then((m) => m.Login),
    },
    {
        path: 'signup',
        loadComponent: () => import('./auth/signup/signup').then((m) => m.Signup),
    },
    {
        path: '',
        component: Layout,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'cart',
                loadComponent: () => import('./features/cart/cart').then((m) => m.Cart),
            },
            {
                path: 'orders',
                component: Orders,
            },
            { path: 'profile', component: Profile },
            {
                path: 'admin',
                canActivate: [RoleGuard],
                data: { roles: ['admin'] },
                loadComponent: () =>
                    import('./admin/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'dealer',
                canActivate: [RoleGuard],
                data: { roles: ['dealer'] },
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'dashboard',
                    },
                    {
                        path: 'dashboard',
                        component: Dashboard
                    },
                    {
                        path: 'products',
                        component: DealerProducts
                    },
                    {
                        path: 'orders',
                        component: DealerOrders
                    },
                ],
            },
            {
                path: 'user',
                canActivate: [RoleGuard],
                data: { roles: ['user'] },
                loadComponent: () =>
                    import('./user/dashboard/dashboard').then((m) => m.Dashboard),
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
