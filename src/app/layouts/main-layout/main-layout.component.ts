import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {HeaderLayout} from '../partials/header.layout';
import {FooterLayout} from '../partials/footer.layout';
import {SidebarLayout} from '../partials/sidebar.layout';

declare var jQuery:any;

@Component({
  selector: '[main-layout]',
  templateUrl: 'app/layouts/main-layout/main-layout.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    HeaderLayout,
    FooterLayout,
    SidebarLayout,    
  ]
})

export class MainLayout implements AfterViewInit{
  subscription:any;

  constructor() {
  }

  ngAfterViewInit() {
    jQuery.AdminLTE.layout.fix();
    jQuery('body').addClass('sidebar-mini');
  }
}
