import { Component,ComponentFactoryResolver } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";


@Component({
  selector: 'app-root',
  templateUrl: 'app/app.component.html',
  directives: [
	  ROUTER_DIRECTIVES,

  ],
  precompile:[LoginComponent]
})
export class AppComponent {

}
