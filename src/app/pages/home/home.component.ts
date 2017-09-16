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
    private howlerModule: any;
    constructor(private api: APIService) {
        let controller = this;
        System.import('vendor/howler/dist/howler.min.js')
            .then(r => {
                this.howlerModule = r
                var sound = new this.howlerModule.Howl({
                    src: ['sounds.webm', 'sounds.mp3'],
                    sprite: {
                        blast: [0, 3000],
                        laser: [4000, 1000],
                        winner: [6000, 5000]
                    }
                });

                // Shoot the laser!
                sound.play('laser');
            })
    }
}
