import { Component, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Auth } from '../../auth/auth';
import { environment } from '../../environment';
import { APIService } from '../../auth/APIService';
import { MusicPlayer } from '../../directives/music-player/player.component'

declare var jQuery: any;

@Component({
    selector: '[login-page]',
    templateUrl: 'app/pages/detail/detail.component.html',
    styleUrls: [
        "app/pages/detail/detail.component.css"
    ],
    directives: [MusicPlayer],
    providers: [APIService, Auth]
})
export class DetailComponent implements AfterViewInit {
    // @ViewChildren('input') viewChildren;   
    @ViewChild("musicPlayer") mainPlayer: MusicPlayer
    constructor(private router: Router, private api: APIService, private auth: Auth) {
        
    }


    ngAfterViewInit() {
        
    }    
}
