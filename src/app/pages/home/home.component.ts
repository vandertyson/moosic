import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { APIService } from '../../auth/APIService';
import { environment } from '../../environment';
import { MusicPlayer } from '../../directives/music-player/player.component'


declare var jQuery: any;
declare var System: any;

@Component({
    selector: 'dashboard',
    templateUrl: 'app/pages/home/home.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [],
    styleUrls: ['app/pages/home/home.component.css'],
    directives: [MusicPlayer]
})

export class HomeComponent {
    constructor(private api: APIService) {
        let controller = this;
    }

    ngAfterViewInit() {
        jQuery('#ca-container').contentcarousel();
        setTimeout(function () {
            jQuery("#ca-container").show()
        }, 2000)

    }
}
