import { RouterConfig }          from '@angular/router';
import { DashboardRoutes } from '../../pages/dashboard/dashboard.routes';
import { MainLayout} from './main-layout.component';
import { MainLayoutGuard }  from './main-layout.guard';
import { UserRoutes } from '../../pages/users/users.routes';


export const MainLayoutRoutes: RouterConfig = [
    {
        path: '',
        component: MainLayout,
        canActivate : [ MainLayoutGuard ],
        children: [
          ...DashboardRoutes,
          ...UserRoutes,                    
        ]
    }
];
