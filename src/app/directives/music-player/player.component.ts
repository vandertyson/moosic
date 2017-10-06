import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { URLSearchParams, Http } from '@angular/http';
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
        'app/directives/music-player/player.component.css',
    ],
    directives: [
        ROUTER_DIRECTIVES,
        Loading
    ],
    viewProviders: [...BS_MODAL_PROVIDERS],
    encapsulation: ViewEncapsulation.None,
})

export class MusicPlayer {
    private playlist = []
    private playlistName = "Now playing"

    private currentSong: any
    private duration: any;
    private ellapsed = 0
    private songEllapsed: any
    private volume = 0.5;
    private currentIndex = 0;
    private playListTooltip: any
    private volumeTooltip: any
    private moodTooltip: any

    constructor(private api: APIService, private http: Http) {

    }

    ngAfterViewInit() {
        let controller = this;
        this.duration = document.getElementById("duration")       
        this.getPlaylist().subscribe(
            r => {
                this.playlist = r.json().tracks
                this.constructHowl(this.playlist);
                this.currentIndex = 0
                this.currentSong = this.playlist[this.currentIndex]
                setTimeout(function () {
                    controller.bootstrapTooltipster()
                    controller.bootstrapVolumeRange()
                    controller.bootstrapVolume()
                    controller.bootstrapMood()
                }, 100)
            },
            e => {

            }
        )
    }

    updatePlaylist(list, index, name, play?) {
        let controller = this;
        if (play) {
            controller.stopCurrentSong();
        }
        this.playlist = list;
        this.playlistName = name;
        controller.currentIndex = index;
        controller.currentSong = controller.playlist[controller.currentIndex]
        this.constructHowl(this.playlist, function () {
            if (play) {
                controller.playCurrentsong();
            }
        });
    }

    constructHowl(playlist, callback?) {
        let controller = this;
        var fullyLoaded = this.playlist.length;
        var loaded = 0;
        playlist.forEach(e => {
            var index = playlist.indexOf(e);
            e.howl = new Howl({
                // src:[e.sou]
                src: ["http://download.f9.stream.nixcdn.com/318e0434cffae828336c86b9a3152247/59d51c1f/NhacCuaTui949/EmGaiMuaRemix-HuongTramDJKhanhHaku-5164092.mp3"],
                // src: ["http://192.168.1.15:8000/recommended_system/music.mp3"],
                html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
                onplay: function () {
                    console.log("on play")
                    controller.songEllapsed = setInterval(function () {
                        controller.ellapsed++
                        var per = controller.ellapsed / e.howl.duration()
                        controller.setProgressBar(per)
                    }, 1000)
                },
                onload: function () {
                    console.log("abc")
                    loaded++
                    if (loaded == fullyLoaded && callback) {
                        callback()
                    }
                },
                onloaderror: function (id, err) {
                    console.log(err)
                },
                onend: function () {
                    clearInterval(controller.songEllapsed)
                    controller.ellapsed = 0
                    controller.setProgressBar(0)
                    controller.next(null)
                },
                onpause: function () {
                    clearInterval(controller.songEllapsed)
                },
                onstop: function () {
                    controller.ellapsed = 0
                    controller.setProgressBar(0)
                }
            })
        })
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
        // this.togglePlayPause()
        // var per = jQuery("#audio-progress-bar").width() / window.innerWidth
        // var sound = this.currentSong.howl;
        // if (sound.state() == "loaded") {
        //     sound.seek(sound.duration() * per)
        //     sound.play()
        // }

        this.playCurrentsong()
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
        this.pauseCurrentSong()
    }

    getPlaylist() {
        return this.api.get("mock/new-playlist.json")
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
        var play = this.currentSong.isPlaying ? true : false
        this.stopCurrentSong()
        this.currentIndex++
        if (this.currentIndex == this.playlist.length) {
            this.currentIndex = 0
        }
        this.currentSong = this.playlist[this.currentIndex]
        // jQuery("#audio-progress-bar").css("width", "0")
        if (play) {
            this.playCurrentsong()
        }
    }

    prev(event) {
        var play = this.currentSong.isPlaying ? true : false
        this.stopCurrentSong()
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.playlist.length - 1
        }
        this.currentSong = this.playlist[this.currentIndex]
        // jQuery("#audio-progress-bar").css("width", "0")
        if (play) {
            this.playCurrentsong()
        }
    }

    playCurrentsong() {
        let controller = this;
        if (!this.currentSong) return
        if (!this.currentSong.howl) return
        if (this.currentSong.howl.state() == "loaded") {
            this.currentSong.isPlaying = true
            this.duration.innerHTML = controller.formatTime(Math.round(this.currentSong.howl.duration()));
            var per = jQuery("#audio-progress-bar").width() / window.innerWidth
            var sound = this.currentSong.howl;
            sound.seek(sound.duration() * per)
            sound.play()
        }
        else {

        }
    }

    pauseCurrentSong() {
        if (this.currentSong && this.currentSong.howl) {
            this.currentSong.isPlaying = false
            this.currentSong.howl.pause();
        }
    }

    stopCurrentSong() {
        clearInterval(this.songEllapsed)
        jQuery("#audio-progress-bar").css("width", "0")
        if (this.currentSong.howl) {
            this.currentSong.isPlaying = false
            this.currentSong.howl.stop()
        }
    }

    bootstrapTooltipster() {
        let controller = this;
        jQuery('#playlistBtn').attr('data-tooltip-content', '#playlistForm');
        this.playListTooltip = jQuery('#playlistBtn').tooltipster({
            animation: 'fade',
            delay: 200,
            theme: 'light',
            interactive: true,
            zIndex: 90000,
            side: ['top'],
            minWidth: 320,
            // maxWidth: 320,
            // trigger: 'custom',
            // triggerOpen: {
            //     click: true,
            //     tap: true
            // },
            // triggerClose: {
            //     click: false,
            //     mouseleave: false,
            //     originClick: true,
            //     scroll: false,
            //     tap: false,
            //     touchleave: false
            // },
            // functionReady: function (instance, helper) {

            // },
        })
        // this.playListTooltip.tooltipster('instance').on('ready', function () {
        //     // jQuery('.tooltipster-content').css('background-color', 'white')
        // });
    }

    smallPlay(event, index) {
        this.stopCurrentSong()
        if (this.currentIndex == index) {
            this.pauseCurrentSong()
        }
        else {
            this.currentIndex = index;
            this.currentSong = this.playlist[this.currentIndex]
            jQuery("#audio-progress-bar").css("width", "0")
            this.playCurrentsong()
        }
    }

    smallPause(event, index) {
        this.pauseCurrentSong()
    }

    bootstrapVolume() {
        let controller = this;
        jQuery('#volume-up,#un-mute').attr('data-tooltip-content', '#volumeForm');
        this.volumeTooltip = jQuery('#volume-up,#un-mute').tooltipster({
            animation: 'fade',
            delay: 200,
            theme: 'light',
            interactive: true,
            zIndex: 90000,
            side: ['top'],
            minWidth: 200,
            // maxWidth: 320,
            // trigger: 'custom',
            // triggerOpen: {
            //     click: true,
            //     tap: true,
            //     hover: true
            // },
            // triggerClose: {
            //     click: false,
            //     mouseleave: false,
            //     originClick: true,
            //     scroll: false,
            //     tap: false,
            //     touchleave: false
            // },
            // functionReady: function (instance, helper) {
            //     setTimeout(function () {
            //         controller.bootstrapVolumeRange()
            //     }, 10)
            // },
        })
        // this.volumeTooltip.tooltipster('instance').on('ready', function () {
        //     setTimeout(function () {
        //         controller.bootstrapVolumeRange()
        //     }, 10)
        // });
    }

    bootstrapVolumeRange() {
        jQuery.get('vendor/admin-lte/plugins/bootstrap-slider/bootstrap-slider.js').then(mod => {
            jQuery('.slider').slider();
        })

        jQuery.get('vendor/admin-lte/plugins/ionslider/ion.rangeSlider.min.js').then(mod => {
            jQuery("#volumeRange").ionRangeSlider({
                min: 0,
                max: 100,
                type: 'single',
                step: 1,
                postfix: " %",
                prettify: false,
                hasGrid: true,
                onChange: function (data) {
                    Howler.volume(data.from / 100)
                },
                onFinish: function (data) {
                    Howler.volume(data.from / 100)
                },
            });
        })
    }

    bootstrapMood() {
        jQuery('#vote').attr('data-tooltip-content', '#moodForm');
        this.moodTooltip = jQuery('#vote').tooltipster({
            animation: 'fade',
            delay: 200,
            theme: 'light',
            interactive: true,
            zIndex: 90000,
            side: ['top'],
            minWidth: 320,
            // maxWidth: 320,
            // trigger: 'custom',
            // triggerOpen: {
            //     click: true,
            //     tap: true
            // },
            // triggerClose: {
            //     click: false,
            //     mouseleave: false,
            //     originClick: true,
            //     scroll: false,
            //     tap: false,
            //     touchleave: false
            // },
            // functionReady: function (instance, helper) {

            // },
        })
    }

    voteSong(mood) {
        try {
            this.sendvoteRequest(mood).subscribe(
                r => {

                },
                e => {

                }
            )
        } catch (error) {

        }
    }

    sendvoteRequest(mood) {
        var param = {
            song_id: this.currentSong.id,
            user_id: localStorage.getItem("user_id"),
            mood: mood
        }
        console.log(param)
        return this.api.post('zz', JSON.stringify(param)).map(res => res)
    }

}
