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
        'app/directives/music-player/player.component.css',
        "vendor/admin-lte/plugins/ionslider/ion.rangeSlider.css",
        "vendor/admin-lte/plugins/ionslider/ion.rangeSlider.skinNice.css",
        "vendor/admin-lte/plugins/bootstrap-slider/slider.css"
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
    private playListTooltip: any
    private volumeTooltip: any

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
                this.currentIndex = 0
                this.currentSong = this.playlist[this.currentIndex]
                setTimeout(function () {
                    controller.bootstrapTooltipster()
                    controller.bootstrapVolume()
                    // controller.bootstrapVolumeRange()
                }, 100)
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
        var play = this.currentSong.isPlaying ? true : false
        this.stopCurrentSong()
        this.currentIndex++
        if (this.currentIndex == this.playlist.length) {
            this.currentIndex = 0
        }
        this.currentSong = this.playlist[this.currentIndex]
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
            functionReady: function (instance, helper) {

            },
        })
        this.playListTooltip.tooltipster('instance').on('ready', function () {
            // jQuery('.tooltipster-content').css('background-color', 'white')
        });
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
            minWidth: 320,
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
            functionReady: function (instance, helper) {
                setTimeout(function () {
                    controller.bootstrapVolumeRange()
                }, 10)
            },
        })
        this.volumeTooltip.tooltipster('instance').on('ready', function () {
            setTimeout(function () {
                controller.bootstrapVolumeRange()
            }, 10)
        });
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
                    console.log(data)
                },
            });
        })
    }
}
