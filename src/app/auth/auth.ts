import {Injectable} from '@angular/core';
import {environment} from '../environment'
import 'rxjs/Rx';


@Injectable()
export class Auth {
  public loggedIn:boolean;
  public token:string;
  public auth2:any;

  constructor() {
    this.loggedIn = false;
    this.emptyLoginData();
  }

  rememberCredentials(username:string, password:string) {
    localStorage.setItem(environment.localStorageVariablesName['loginEmail'], username);
    localStorage.setItem(environment.localStorageVariablesName['loginPassword'], password);
  }

  hadRememberedCredentials() {
    if (localStorage.getItem(environment.localStorageVariablesName['loginEmail']) === null) {
      return false;
    }
    if (localStorage.getItem(environment.localStorageVariablesName['loginPassword']) === null) {
      return false;
    }
    return true;
  }

  getRememberedCredentials() {
    var obj =
    {
      username: localStorage.getItem(environment.localStorageVariablesName['loginEmail']),
      password: localStorage.getItem(environment.localStorageVariablesName['loginPassword'])
    }
    return obj;
  }

  clearRememberedCredentials() {
    if (localStorage.getItem(environment.localStorageVariablesName['loginEmail']) !== null) {
      localStorage.removeItem(environment.localStorageVariablesName['loginEmail']);
    }

    if (localStorage.getItem(environment.localStorageVariablesName['loginPassword']) !== null) {
      localStorage.removeItem(environment.localStorageVariablesName['loginPassword']);
    }
  }

  login(fallBackedToken:string) {    
    this.loggedIn = true;
    this.token = fallBackedToken;
    localStorage.setItem('jwt', this.token);
  }

  loginFromSession() {
    if (localStorage.getItem("jwt") !== null && this.loggedIn === false) {
      var jwt = localStorage.getItem("jwt");
      this.login(jwt);
    }
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  isValidAuthentication():boolean {
    if (localStorage.getItem('jwt') === null) {
      return false;
    }
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      if (this.check_token_expired(jwt)) {
        this.logout();
        return false;
      }
      else {
        this.loginFromSession();
        return true;
      }
    }
    return false;
  }

  emptyLoginData() {
    this.token = '';
  }

  check_token_expired(jwt:any) {
    return false;
  }
}
