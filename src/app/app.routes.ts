import { provideRouter, RouterConfig } from '@angular/router';
import { LoginLayoutRoutes } from './layouts/login-layout/login-layout.routes';
import { MainLayoutRoutes } from './layouts/main-layout/main-layout.routes';

export const routes: RouterConfig = [
    ...LoginLayoutRoutes,
    ...MainLayoutRoutes
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes),
];
