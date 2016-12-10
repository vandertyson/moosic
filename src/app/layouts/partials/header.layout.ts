import {Component} from '@angular/core';
import {Auth} from '../../auth/auth';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: '[header-layout]',
  templateUrl: 'app/layouts/partials/header.layout.html',
  directives: [ROUTER_DIRECTIVES]
})
export class HeaderLayout {
  constructor(private router:Router, private _auth: Auth) {

  }

  logout():void {
    this._auth.logout();
    this.router.navigate(['/login']);
  }

  viewProfile():void {

  }
}
