import { Component }  from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: '[sidebar-layout]',
  templateUrl: 'app/layouts/partials/sidebar.layout.html',
  directives: [ROUTER_DIRECTIVES]

})
export class SidebarLayout {

}

