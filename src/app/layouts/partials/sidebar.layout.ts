import { Component, Output, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { Auth } from '../../auth/auth';

@Component({
  selector: '[sidebar-layout]',
  templateUrl: 'app/layouts/partials/sidebar.layout.html',
  directives: [ROUTER_DIRECTIVES]

})
export class SidebarLayout {
  @Output() logout = new EventEmitter();
  constructor(private router: Router, private auth: Auth) {

  }

  logOut(): void {
    this.logout.emit({ logout: true })
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}

