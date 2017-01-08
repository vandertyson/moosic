import { RouterConfig }          from '@angular/router';
import { DashboardRoutes } from '../../pages/dashboard/dashboard.routes';
import { MainLayout} from './main-layout.component';
import { MainLayoutGuard }  from './main-layout.guard';
import { UserRoutes } from '../../pages/users/users.routes';
import { SalaryRoute } from '../../pages/salary/salary.route';
import { ChamCongRoute } from '../../pages/calculate/calculate.route';
import { ProfileRoute } from '../../pages/profile/profile.route';


export const MainLayoutRoutes: RouterConfig = [
    {
        path: '',
        component: MainLayout,
        canActivate: [MainLayoutGuard],
        children: [
            ...DashboardRoutes,
            ...UserRoutes,
            ...SalaryRoute,
            ...ChamCongRoute,
            ...ProfileRoute
        ]
    }
];
