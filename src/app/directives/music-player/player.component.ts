import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import 'rxjs/Rx';
import { environment } from '../../environment';
import { APIService } from '../../auth/APIService';
import { Loading } from "../../layouts/partials/loading.component";
import { Modal, BSModal, BS_MODAL_PROVIDERS } from 'angular2-modal/plugins/bootstrap';
import { MessageService } from "../../services/message-service/message.service";

declare var jQuery: any;
declare var System: any;
declare var Howl: any;
declare var Howler: any;

@Component({
    selector: 'music-player',
    templateUrl: 'app/directives/music-player/player.component.html',
    styleUrls: [
        'app/directives/music-player/player.component.css'
    ],
    directives: [
        ROUTER_DIRECTIVES,
        Loading
    ],
    viewProviders: [...BS_MODAL_PROVIDERS],
    encapsulation: ViewEncapsulation.None
})

export class MusicPlayer {
    private playlist = []

    private currentSong: any
    private duration: any;
    private ellapsed = 0
    private songEllapsed: any
    private volume = 50;
    private currentIndex = 0;
    private currentLoading = true

    constructor(private api: APIService) {

    }

    ngAfterViewInit() {
        let controller = this;
        this.duration = document.getElementById("duration")
        this.getPlaylist().subscribe(
            r => {
                this.playlist = r.json().result
                this.playlist.forEach(e => {
                    var index = this.playlist.indexOf(e);
                    e.howl = new Howl({
                        src: [e.src],
                        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
                        onplay: function () {
                            controller.songEllapsed = setInterval(function () {
                                controller.ellapsed++
                                var per = controller.ellapsed / e.howl.duration()
                                controller.setProgressBar(per)
                            }, 1000)
                        },
                        onload: function () {
                            if (index == controller.currentIndex) {
                                controller.currentLoading = false
                            }
                        },
                        onend: function () {
                            // Stop the wave animation.
                            // wave.container.style.display = 'none';
                            // bar.style.display = 'block';
                            // self.skip('right');
                            clearInterval(controller.songEllapsed)
                            controller.ellapsed = 0
                            controller.setProgressBar(0)
                        },
                        onpause: function () {
                            // Stop the wave animation.
                            // wave.container.style.display = 'none';
                            // bar.style.display = 'block';
                            clearInterval(controller.songEllapsed)
                        },
                        onstop: function () {
                            // Stop the wave animation.
                            // wave.container.style.display = 'none';
                            // bar.style.display = 'block';
                            controller.ellapsed = 0
                            controller.setProgressBar(0)
                        }
                    })
                })
                this.currentIndex = 0
                this.currentSong = this.playlist[this.currentIndex]
                console.log(this.currentSong.howl.state())
                // if (this.currentSong.howl.state() == "loaded") {
                //     this.currentLoading = false
                // }
                // for (var song of this.playlist) {
                //     if (song.howl.state() == "loaded") {
                //         this.currentSong = song
                //         return
                //     }
                // }
            },
            e => {

            }
        )

    }

    formatTime(secs) {
        var minutes = Math.floor(secs / 60) || 0;
        var seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    togglePlayPause() {
        if (jQuery("#pause").is(":visible")) {
            jQuery("#pause").hide()
            jQuery("#play").show()
        }
        else {
            jQuery("#pause").show()
            jQuery("#play").hide()
        }
    }

    play(event?) {
        this.togglePlayPause()
        var per = jQuery("#audio-progress-bar").width() / window.innerWidth
        var sound = this.currentSong.howl;
        if (sound.state() == "loaded") {
            sound.seek(sound.duration() * per)
            sound.play()
        }

    }

    seek(event) {
        let controller = this;
        var per = event.clientX / window.innerWidth;
        this.setProgressBar(per)
        if (this.currentSong && this.currentSong.howl) {
            var sound = this.currentSong.howl;
            this.ellapsed = Math.floor(sound.duration() * per)
            if (sound.playing()) {
                sound.seek(sound.duration() * per);
            }
        }
    }

    pause() {
        this.togglePlayPause()
        if (this.currentSong && this.currentSong.howl) {
            this.currentSong.howl.pause();
        }
    }

    getPlaylist() {
        return this.api.get("mock/songs.json")
    }

    getElapsed() {
        return this.formatTime(this.ellapsed)
    }

    setProgressBar(per) {
        jQuery("#audio-progress-bar").css("width", per * 100 + "%")
    }

    mute(event) {
        Howler.mute(true)
        jQuery("#un-mute").show()
        jQuery("#volume-up").hide()
    }

    unMute(event) {
        Howler.mute(false)
        jQuery("#un-mute").hide()
        jQuery("#volume-up").show()
    }

    next(event) {
        this.stopCurrentSong()
        this.currentIndex++
        if (this.currentIndex == this.playlist.length) {
            this.currentIndex = 0
        }
        this.currentSong = this.playlist[this.currentIndex]
        this.playCurrentsong()

    }

    prev(event) {
        this.stopCurrentSong()
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.playlist.length - 1
        }
        this.currentSong = this.playlist[this.currentIndex]
        this.playCurrentsong()
    }

    playCurrentsong() {
        let controller = this;
        if (!this.currentSong) return
        if (!this.currentSong.howl) return
        if (this.currentSong.howl.state() == "loaded") {
            this.currentLoading = false
            controller.duration.innerHTML = controller.formatTime(Math.round(this.currentSong.howl.duration()));
            setTimeout(function () {
                if (jQuery("#pause").is(":visible")) {
                    controller.currentSong.howl.play();
                }
            }, 100)
        }
        else {
            this.currentLoading = true
        }
    }

    stopCurrentSong() {
        clearInterval(this.songEllapsed)
        if (this.currentSong.howl) {
            this.currentSong.howl.stop()
        }
    }
}
