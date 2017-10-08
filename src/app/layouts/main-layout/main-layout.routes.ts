import { RouterConfig } from '@angular/router';
import { HomeRoutes } from '../../pages/home/home.route';
import { MainLayout } from './main-layout.component';
import { MainLayoutGuard } from './main-layout.guard';
import { DetailRoutes } from '../../pages/detail/detail.route';



export const MainLayoutRoutes: RouterConfig = [
    {
        path: '',
        component: MainLayout,
        canActivate: [MainLayoutGuard],
        children: [
            ...HomeRoutes,
            ...DetailRoutes            
        ]
    }
];
