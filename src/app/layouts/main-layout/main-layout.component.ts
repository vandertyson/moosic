import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HeaderLayout } from '../partials/header.layout';
import { FooterLayout } from '../partials/footer.layout';
import { SidebarLayout } from '../partials/sidebar.layout';
import { MusicPlayer } from '../../directives/music-player/player.component'
import { AppStateService } from '../../services/app-state.service'
import { Router, RouterOutletMap, RouterOutlet, PRIMARY_OUTLET, ActivatedRoute } from '@angular/router';


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
  ],
  styleUrls: ["app/layouts/main-layout/main.component.css"]
})

export class MainLayout implements AfterViewInit {
  subscription: any;
  rootOutletMap: RouterOutletMap;

  // @ViewChild("musicPlayer") mainPlayer: MusicPlayer
  @ViewChild("menu") sideMenu: SidebarLayout

  constructor(private router: Router, private activeRoute: ActivatedRoute, private appState: AppStateService) {
    this.rootOutletMap = (<any>this.router).outletMap;
  }

  ngAfterViewInit() {
    jQuery.AdminLTE.layout.fix();
    jQuery('body').addClass('sidebar-mini');
    // console.log(this.rootOutletMap['_outlets'].PRIMARY_OUTLET)    
    this.appState.playlistChange.subscribe(
      r => {
        // this.mainPlayer.updatePlaylist(r.playlist, r.startAt, r.playListName, true)
      },
      e => {

      }
    )
  }

  onLogout(event) {
    // console.log(event)
    // this.mainPlayer.stopCurrentSong()
  }

  onActivate(event) {
    console.log(event)
  }

  onDeactivate(event) {
    console.log(event)
  }

}
