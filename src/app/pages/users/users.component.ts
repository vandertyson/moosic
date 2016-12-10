import { Router, ROUTER_DIRECTIVES} from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: '[users-layout]',
  templateUrl: 'app/pages/users/users.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class UsersLayout {
 
}