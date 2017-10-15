import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { URLSearchParams, Http } from '@angular/http';
import 'rxjs/Rx';
import { environment } from '../../environment';
import { APIService } from '../../auth/APIService';
import { Loading } from "../../layouts/partials/loading.component";
import { Modal, BSModal, BS_MODAL_PROVIDERS } from 'angular2-modal/plugins/bootstrap';
import { MessageService } from "../../services/message-service/message.service";
import { AppStateService } from "../../services/app-state.service";

declare var jQuery: any;
declare var System: any;

@Component({
    selector: 'song-player',
    templateUrl: 'app/directives/song-player/player.component.html',
    styleUrls: [
        'app/directives/song-player/player.component.css',
    ],
    directives: [
        ROUTER_DIRECTIVES,
        Loading
    ],
    viewProviders: [...BS_MODAL_PROVIDERS],
    encapsulation: ViewEncapsulation.None,
})

export class SongPlayer {
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

    constructor(private api: APIService, private http: Http, private appState: AppStateService) {

    }

    ngAfterViewInit() {
        let controller = this;
        this.duration = document.getElementById("duration")
        setTimeout(function () {
            controller.bootstrapTooltipster()
            controller.bootstrapVolumeRange()
            controller.bootstrapVolume()
            controller.bootstrapMood()
        }, 100)
        this.appState.setProgressBar.subscribe(
            r => {
                this.setProgressBar(r)
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
        this.appState.playCurrentsong()
    }

    seek(event) {
        let controller = this;
        var parentWidth = jQuery("#bar-width").width()
        var per = event.clientX / parentWidth;
        this.appState.seek(event, per)
    }

    pause() {
        this.appState.pauseCurrentSong()
    }

    getElapsed() {
        return this.formatTime(this.ellapsed)
    }

    setProgressBar(per) {
        jQuery("#audio-progress-bar").css("width", per * 50 + "%")
    }

    mute(event) {
        this.appState.mute(event);
        jQuery("#un-mute").show()
        jQuery("#volume-up").hide()
    }

    unMute(event) {
        this.appState.unMute(event);
        jQuery("#un-mute").hide()
        jQuery("#volume-up").show()
    }

    next(event) {
        this.appState.next(event)
    }

    prev(event) {
        this.appState.prev(event)
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
        this.appState.stopCurrentSong()
        if (this.appState.currentIndex == index) {
            this.appState.pauseCurrentSong()
        }
        else {
            this.appState.currentIndex = index;
            this.appState.currentSong = this.appState.playlist[this.appState.currentIndex]
            jQuery("#audio-progress-bar").css("width", "0")
            this.appState.playCurrentsong()
            this.appState.songChange.emit(true)
        }
    }

    smallPause(event, index) {
        this.appState.pauseCurrentSong()
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
        let controller = this;
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
                    controller.appState.setVolume(data.from / 100)
                },
                onFinish: function (data) {
                    controller.appState.setVolume(data.from / 100)
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
