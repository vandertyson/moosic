import { Component, AfterViewInit, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Auth } from '../../auth/auth';
import { environment } from '../../environment';
import { APIService } from '../../auth/APIService';
import { SongPlayer } from '../../directives/song-player/player.component'
import { MusicPlayer } from '../../directives/music-player/player.component'
import { AppStateService } from '../../services/app-state.service'
import { TagComponent } from "../../directives/tag/tag.component"
import { URLSearchParams } from '@angular/http';

declare var jQuery: any;

@Component({
    selector: '[login-page]',
    templateUrl: 'app/pages/detail/detail.component.html',
    styleUrls: [
        "app/pages/detail/detail.component.css"
    ],
    directives: [SongPlayer, MusicPlayer, TagComponent],
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
        let controller = this;
        if (this.appState.currentSong) {
            if (this.recommendedSongs.length == 0) {
                this.fillRecomendation()
            }
            this.appState.songChange.subscribe(
                zz => {
                    // if (zz) {
                        controller.recommendedSongs = []
                        this.fillRecomendation()
                    // }
                }
            )
        }
        else {
            this.router.navigate(["/"])
        }
    }

    getRecommendationSongs(song) {
        let controller = this;
        var param = new URLSearchParams();
        param.set('track_id',song.track_id)
        param.set('user_id','12345')
        return this.api.get(environment.endPoint+environment.recommendNextUrl,param).map(res=>res)
    }

    getSongArt(song) {

        if ( !song.album_art || song.album_art == 'None') {
            return "assets/img/defaultArt.png";
            }
        return song.album_art;
        }

    onPlayRecommendedClick(event, index) {
        let controller = this;
        this.appState.isPausing = false;
        this.appState.updatePlaylist(this.recommendedSongs, index, "Recommended For You", true, function(){
            controller.appState.songChange.emit(true)   
        })
    }

    getBestLabel(song) {
        var result = [
            "mood", "label label-primary"
        ]
        var t = Math.floor(Math.random() * 2) + 1
        switch (t) {
            case 2:
                return [
                    "mood", "label label-primary"
                ]

            case 1:
                return [
                    "genre", "label label-success"
                ]

            default:
                return [
                    "mood", "label label-primary"
                ]
        }
    }

    fillRecomendation() {
        let controller = this
        setTimeout(function () {
            controller.getRecommendationSongs(controller.appState.currentSong)
                .subscribe(
                r => {
                    controller.recommendedSongs = r.json().tracks
                },
                e => {

                })
        }, 1000)
    }
}
