import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/index';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { APIService } from './app/auth/APIService'
import { HTTP_PROVIDERS } from '@angular/http';
import { LogInGuard } from './app/layouts/login-layout/login.guard';
import { MainLayoutGuard } from './app/layouts/main-layout/main-layout.guard';
import { Auth } from './app/auth/auth';
import { MODAL_BROWSER_PROVIDERS } from 'angular2-modal/platform-browser/index';
import { MessageService } from "./app/services/message-service/message.service";
import { AppStateService } from './app/services/app-state.service'

if (environment.production) {
  enableProdMode();
}

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS,
  Auth,
  LogInGuard,
  MainLayoutGuard,
  HTTP_PROVIDERS,
  APIService,
  disableDeprecatedForms(),
  provideForms(),
  MODAL_BROWSER_PROVIDERS,
  MessageService,
  AppStateService
]);
