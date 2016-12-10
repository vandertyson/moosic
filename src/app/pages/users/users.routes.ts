import { RouterConfig } from '@angular/router';
import { UsersLayout } from './users.component';
import { UserListRoutes } from './list/user-list.routes';
import { UserAddRoutes } from './add/user-add.route';
import { UserEditRoutes } from './edit/user-edit.routes'


export const UserRoutes:RouterConfig = [
  {
    path: 'users',
    component: UsersLayout,
    children: [
      ...UserListRoutes,
      ...UserAddRoutes,
      ...UserEditRoutes
    ]
  }
]
