import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HeaderLayout } from '../partials/header.layout';
import { FooterLayout } from '../partials/footer.layout';
import { SidebarLayout } from '../partials/sidebar.layout';
import { MusicPlayer } from '../../directives/music-player/player.component'

declare var jQuery: any;

@Component({
  selector: '[main-layout]',
  templateUrl: 'app/layouts/main-layout/main-layout.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    HeaderLayout,
    FooterLayout,
    SidebarLayout,
    MusicPlayer
  ]
})

export class MainLayout implements AfterViewInit {
  subscription: any;

  @ViewChild("musicPlayer") mainPlayer: MusicPlayer
  @ViewChild("menu") sideMenu: SidebarLayout

  constructor() {

  }

  ngAfterViewInit() {
    jQuery.AdminLTE.layout.fix();
    jQuery('body').addClass('sidebar-mini');    
  }

  onLogout(event){
    console.log(event)
    this.mainPlayer.stopCurrentSong()
  }
}
