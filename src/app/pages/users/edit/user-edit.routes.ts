import { RouterConfig } from '@angular/router';
import { UserEditComponent } from './user-edit.component';

export const UserEditRoutes:RouterConfig = [
  {
    path: ':id',
    component: UserEditComponent,    
  }
];

