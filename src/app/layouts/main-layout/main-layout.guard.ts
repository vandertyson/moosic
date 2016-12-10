import { Injectable } from '@angular/core';
import { Auth } from '../../auth/auth';
import { Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot,
        CanActivate
       } from '@angular/router';

@Injectable()
export class MainLayoutGuard implements CanActivate {
  constructor(private authService: Auth, private router: Router) {

  }
  canActivate(
    // Not using but worth knowing about
    next:  ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
     if(!this.authService.isValidAuthentication()||!this.authService.loggedIn){
       this.router.navigate(['/login']);
       return false;
     }
    return true;
  }

}
