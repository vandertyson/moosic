import { RouterConfig } from '@angular/router';
import { LoginComponent } from '../../pages/login/login.component';
import { LogInGuard } from './login.guard'

export const LoginLayoutRoutes: RouterConfig = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [ LogInGuard ]
    }
];
