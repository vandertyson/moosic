import { Component, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Auth } from '../../auth/auth';
import { environment } from '../../environment';
import { APIService } from '../../auth/APIService';
import { SongPlayer } from '../../directives/song-player/player.component'
import { MusicPlayer } from '../../directives/music-player/player.component'
import { AppStateService } from '../../services/app-state.service'

declare var jQuery: any;

@Component({
    selector: '[login-page]',
    templateUrl: 'app/pages/detail/detail.component.html',
    styleUrls: [
        "app/pages/detail/detail.component.css"
    ],
    directives: [SongPlayer, MusicPlayer],
    providers: [APIService, Auth]
})
export class DetailComponent implements AfterViewInit {
    // @ViewChildren('input') viewChildren;   
    private recommendedSongs = []
    @ViewChild("musicPlayer") mainPlayer: SongPlayer
    // @ViewChild("musicPlayer") mainPlayer: MusicPlayer
    constructor(private router: Router, private api: APIService, private auth: Auth, private appState: AppStateService) {

    }


    ngAfterViewInit() {
        this.appState.playlistChange.subscribe(
            r => {
                this.mainPlayer.updatePlaylist(r.playlist, r.startAt, r.playListName, true)                
                this.getRecommendationSongs(this.appState.currentSong)
            },
            e => {

            }
        )
    }

    getRecommendationSongs(song) {
        console.log(song)
        this.api.get(environment.recommendNextUrl)
    }
}
