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
                    controller.recommendedSongs = []
                    this.fillRecomendation()
                }
            )
        }
        else {
            this.router.navigate(["/"])
        }
    }

    getRecommendationSongs(song) {
        let controller = this;
        return this.api.get(environment.recommendNextUrl)
    }

    getSongArt(song) {
        return song.album_art ? song.album_art : "assets/img/defaultArt.png"
    }

    onPlayRecommendedClick(event, index) {
        this.appState.updatePlaylist(this.recommendedSongs, index, "Recommended For You", true)
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
