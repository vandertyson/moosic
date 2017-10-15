import { Component, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { APIService } from '../../auth/APIService';
import { environment } from '../../environment';
import { MusicPlayer } from '../../directives/music-player/player.component'
import { AppStateService } from '../../services/app-state.service'
import { Router } from '@angular/router';

declare var jQuery: any;
declare var System: any;

@Component({
    selector: 'dashboard',
    templateUrl: 'app/pages/home/home.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [],
    styleUrls: ['app/pages/home/home.component.css',
        'assets/css/style.css'],
    directives: [MusicPlayer]
})

export class HomeComponent {
    // @ViewChild("musicPlayer") mainPlayer: MusicPlayer
    private youLike = []
    private hotTrend = [];
    private recently = [];
    private searchResult = [];

    private searchWord = '';
    private searchMood = 'all';
    private searchArtist = '';

    private zz = 0;
    private searched = false
    private searchSlider: any;
    private searchStatus = '';
    private showNow = true;
    private showIntervel: any;

    constructor(private api: APIService, private appState: AppStateService, private router: Router) {
        let controller = this;
    }

    ngAfterViewInit() {
        let controller = this;
        jQuery('.dropdown-menu').click(function (e) {
            e.stopPropagation();
        });
        if (this.appState.currentSong && this.appState.currentSong.isPlaying) {
            this.showNow = true;
            jQuery("#showingNow").fadeIn("fast").delay(4000).fadeOut("fast")
        }
        // this.bootstrapSelect2emoji()
        // this.bootstrapSelect2artist()
        // this.api.get(environment.genrUrl).map(res => res)
        //     .subscribe(
        //     r => {
        //         this.bootstrapSelect2genre(r.json())
        //     },
        //     e => {

        //     })
        this.api.get(environment.tagsUrl).map(res => res)
            .subscribe(
            r => {
                this.bootStrapSmartSearch(r.json().results)
            },
            e => {

            })
        jQuery("#emojiSelect").focus()
        setInterval(function () {
            controller.showNow = !controller.showNow
        }, 5000)
        this.getYouLike().subscribe(
            r => {
                this.youLike = r.json().tracks
                setTimeout(function () {
                    jQuery('.you-like').lightSlider({
                        item: 6,
                        // auto:true,
                        loop: true,
                        // autoWidth: true,
                        adaptiveHeight: false,
                        slideMove: 2,
                        easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
                        speed: 600,
                        responsive: [
                            {
                                breakpoint: 800,
                                settings: {
                                    item: 3,
                                    slideMove: 1,
                                    slideMargin: 6,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    item: 2,
                                    slideMove: 1
                                }
                            }
                        ],
                        // pauseOnHover: true,
                    });
                    for (var i in controller.youLike) {
                        // if (jQuery('#like' + i)[0].scrollWidth > jQuery('#like' + i).innerWidth()) {
                        //Text has over-flowed
                        jQuery('#like' + i).attr('data-tooltip-content', '#likeShow' + i);
                        jQuery('#like' + i).tooltipster({
                            animation: 'fade',
                            delay: 200,
                            theme: 'light',
                            interactive: true,
                            zIndex: 90000,
                            side: ['top'],
                        })
                        // }
                    }
                }, 100)
            },
            e => {

            }
        )
        this.getHotTrend().subscribe(
            r => {
                this.hotTrend = r.json().tracks
                setTimeout(function () {
                    jQuery('.hot-trend').lightSlider({
                        item: 6,
                        // auto:true,
                        loop: true,
                        // autoWidth: true,
                        adaptiveHeight: false,
                        slideMove: 2,
                        easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
                        speed: 600,
                        responsive: [
                            {
                                breakpoint: 800,
                                settings: {
                                    item: 3,
                                    slideMove: 1,
                                    slideMargin: 6,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    item: 2,
                                    slideMove: 1
                                }
                            }
                        ],
                        // pauseOnHover: true,
                    });
                    for (var i in controller.hotTrend) {
                        jQuery('#hot' + i).attr('data-tooltip-content', '#hotShow' + i);
                        jQuery('#hot' + i).tooltipster({
                            animation: 'fade',
                            delay: 200,
                            theme: 'light',
                            interactive: true,
                            zIndex: 90000,
                            side: ['top'],
                        })
                    }
                }, 100)
            },
            e => {

            }
        )
        this.getRecent().subscribe(
            r => {
                this.recently = r.json().tracks
                setTimeout(function () {
                    jQuery('.recent').lightSlider({
                        item: 6,
                        // auto:true,
                        loop: true,
                        // autoWidth: true,
                        adaptiveHeight: false,
                        slideMove: 2,
                        easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
                        speed: 600,
                        responsive: [
                            {
                                breakpoint: 800,
                                settings: {
                                    item: 3,
                                    slideMove: 1,
                                    slideMargin: 6,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    item: 2,
                                    slideMove: 1
                                }
                            }
                        ],
                        // pauseOnHover: true,
                    });
                    for (var i in controller.recently) {
                        jQuery('#recent' + i).attr('data-tooltip-content', '#recentShow' + i);
                        jQuery('#recent' + i).tooltipster({
                            animation: 'fade',
                            delay: 200,
                            theme: 'light',
                            interactive: true,
                            zIndex: 90000,
                            side: ['top'],
                        })
                    }
                }, 100)
            },
            e => {

            }
        )
    }

    getHotTrend() {
        return this.api.get(environment.endPoint + environment.hotTrendUrl).map(res => res)
    }

    getYouLike() {
        return this.api.get(environment.endPoint + environment.youLikeUrl).map(res => res)
    }

    getRecent() {
        return this.api.get(environment.endPoint + environment.recentlyUrl).map(res => res)
    }

    getSearchSong(params?) {
        var url = environment.endPoint + environment.search1Url
        // this.zz++
        // if (this.zz % 2 == 0) {
        //     url = environment.search2Url
        // }
        var param = new URLSearchParams();
        if (this.searchMood && this.searchMood != '') {
            param.set('mood', this.searchMood)
        }
        if (this.searchWord && this.searchWord != '') {
            param.set('keyword', this.searchWord)
        }
        if (this.searchArtist && this.searchArtist != '') {
            param.set('artist', this.searchArtist)
        }
        return this.api.get(url, param).map(res => res)
        // return this.api.get(url).map(res => res)
    }

    onSearchSubmit(event) {
        try {
            let controller = this;
            jQuery('.search')[0].scrollIntoView()
            if (!this.searched) {
                jQuery('.search').slideDown('fast')
                this.searched = true
            }
            else {
                jQuery('.result-zone').slideUp('fast')
            }
            this.searchStatus = "Searching..."
            console.log(jQuery('#smartSearch'))
            setTimeout(function () {
                controller.getSearchSong().subscribe(
                    r => {
                        controller.searchResult = r.json().tracks
                        if (controller.searchResult.length == 0) {
                            controller.searchStatus = "Oops! No song found for your setting"
                            return
                        }
                        controller.searchStatus = controller.searchResult.length + " songs found "
                        if (!controller.searchSlider) {
                            setTimeout(function () {
                                controller.buildSearchSlider();
                                for (var i in controller.searchResult) {
                                    jQuery('#search' + i).attr('data-tooltip-content', '#searchShow' + i);
                                    jQuery('#search' + i).tooltipster({
                                        animation: 'fade',
                                        delay: 200,
                                        theme: 'light',
                                        interactive: true,
                                        zIndex: 90000,
                                        side: ['top'],
                                    })
                                }
                            }, 100)
                        }
                        else {
                            controller.searchSlider.destroy();
                            controller.searchSlider = null;
                            jQuery('.result-zone').slideDown('fast')
                            controller.buildSearchSlider()
                        }
                    },
                    e => {
                        controller.searchStatus = "Oops! Some errors happened"
                    }
                )
            }, 1000)
        } catch (error) {

        }
    }

    onPlay(listIndex, songIndex) {
        let controller = this;
        try {
            var data = {
                playlist: [],
                playListName: '',
                startAt: songIndex
            }

            switch (listIndex) {
                case 0:
                    data.playlist = this.youLike
                    data.playListName = "May be you like"
                    break;
                case 1:
                    data.playlist = this.hotTrend
                    data.playListName = "Now trending"
                    break;
                case 2:
                    data.playlist = this.recently
                    data.playListName = "Recently listening"
                    break;
                case 3:
                    data.playlist = this.searchResult
                    data.playListName = "Song for you"
                    break
                default:
                    break;
            }
            this.appState.updatePlaylist(data.playlist, data.startAt, data.playListName, true, function () {
                controller.appState.songChange.emit(true)
            })
            this.router.navigate(["/listen"])
            // this.appState.updatePlaylist() = data[songIndex]
            // this.appState.playlistChange.emit(data)

        } catch (error) {

        }
    }

    hideSearchResult() {

    }

    buildSearchSlider() {
        this.searchSlider = jQuery('.search-result').lightSlider({
            item: 6,
            // auto:true,
            loop: true,
            // autoWidth: true,
            adaptiveHeight: true,
            slideMove: 2,
            easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
            speed: 600,
            responsive: [
                {
                    breakpoint: 800,
                    settings: {
                        item: 3,
                        slideMove: 1,
                        slideMargin: 6,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        item: 2,
                        slideMove: 1
                    }
                }
            ],
        });
    }

    getSongArt(song) {
        return song.album_art ? song.album_art : "assets/img/defaultArt.png"
    }

    showPlayingNow() {
        console.log("show")
        jQuery("#showingNow").show()
    }

    hidePlayingNow() {
        console.log("hide")
        jQuery("#showingNow").hide()
    }

    toListenPgae() {
        this.router.navigate(["/listen"])
    }

    getNextSong() {
        return this.appState.playlist[this.appState.currentIndex + 1]
    }


    bootstrapSelect2emoji() {
        jQuery("#emojiSelect").select2({
            width: 'resolve',
            multiple: true,
            minimumResultsForSearch: Infinity,
            theme: "bootstrap",
            placeholder: 'How are you feeling?',
            data: [
                {
                    id: 0,
                    text: "Happy",
                    image: "em em-smiley"
                },
                {
                    id: 1,
                    text: "Relaxed",
                    image: "em em-relaxed"
                },
                {
                    id: 2,
                    text: "Sad",
                    image: "em em-disappointed"
                },
                {
                    id: 3,
                    text: "Angry",
                    image: "em em-angry"
                }
            ],
            templateSelection: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    "<i class='" + state.image + "'></i>&#160;&#160;<span>" + state.text + '</span>'
                );
                return $state;
            },
            templateResult: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    "<span style='font-size:small'><i class='" + state.image + "'></i>&#160;&#160;<span>" + state.text + '</span></span>'
                );
                return $state;
            }
        })
    }

    bootstrapSelect2artist() {
        jQuery("#emojiArtist").select2({
            width: 'resolve',
            multiple: true,
            minimumResultsForSearch: Infinity,
            theme: "bootstrap",
            placeholder: 'Who is your favourite artist?',
            ajax: {
                // url: 'https://api.github.com/search/repositories',
                url: environment.artistUrl,
                dataType: 'json',
                processResults: function (data) {
                    // Tranforms the top-level key of the response object from 'items' to 'results'
                    return {
                        results: data
                    };
                }
            },
            templateSelection: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    '<span><img src="' + state.image + '" class="img-flag" style="width:20px"/> ' + state.text + '</span>'
                );
                return $state;
            },
            templateResult: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    '<span style="font-size:small"><img src="' + state.image + '" class="img-flag"  style="width:50px" /> ' + state.text + '</span>'
                );
                return $state;
            }
        })
    }

    bootstrapSelect2genre(data) {
        jQuery("#emojiGenre").select2({
            width: 'resolve',
            multiple: true,
            minimumResultsForSearch: Infinity,
            theme: "bootstrap",
            placeholder: 'What is your favourite genre?',
            data: data,
            templateSelection: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    '<span>' + state.text + '</span>'
                );
                return $state;
            },
            templateResult: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    '<span style="font-size:small">' + state.text + '</span>'
                );
                return $state;
            }
        })
    }

    bootStrapFastSearch() {
        jQuery("#fastSearch").select2({
            width: 'resolve',
            multiple: true,
            minimumResultsForSearch: Infinity,
            theme: "bootstrap",
            placeholder: 'What is your favourite genre?',
            ajax: {
                // url: 'https://api.github.com/search/repositories',
                url: environment.artistUrl,
                dataType: 'json',
                processResults: function (data) {
                    // Tranforms the top-level key of the response object from 'items' to 'results'
                    return {
                        results: data
                    };
                }
            },
            templateSelection: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    '<span>' + state.text + '</span>'
                );
                return $state;
            },
            templateResult: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    '<span style="font-size:small">' + state.text + '</span>'
                );
                return $state;
            }
        })
    }

    bootStrapSmartSearch(data) {
        let controller = this;
        jQuery("#smartSearch").select2({
            width: 'resolve',
            multiple: true,
            minimumResultsForSearch: Infinity,
            theme: "bootstrap",
            placeholder: 'How are you feeling?',
            // ajax: {
            //     // url: 'https://api.github.com/search/repositories',
            //     url: environment.tagsUrl,
            //     dataType: 'json',
            //     processResults: function (data) {
            //         // Tranforms the top-level key of the response object from 'items' to 'results'
            //         return {
            //             results: data.results
            //         };
            //     }
            // },
            data: data,
            // maximumSelectionLength: 3,
            templateSelection: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    '<span>' + state.text + '</span>'
                );
                if (state.image) {
                    $state = jQuery(
                        '<span><img src="' + state.image + '" class="img-flag"  style="width:20px" /> ' + state.text + '</span>'
                    );
                }
                else if (state.icon) {
                    $state = jQuery(
                        "<i class='" + state.icon + "'></i>&#160;&#160;<span>" + state.text + '</span>'
                    );
                }
                else {

                }
                return $state;
            },
            templateResult: function formatState(state) {
                if (!state.id) {
                    return state.text;
                }
                var $state = jQuery(
                    '<span>' + state.text + '</span>'
                );
                if (state.image) {
                    $state = jQuery(
                        '<span style="font-size:small"><img src="' + state.image + '" class="img-flag"  style="width:50px" /> ' + state.text + '</span>'
                    );
                }
                else if (state.icon) {
                    $state = jQuery(
                        "<span style='font-size:small'><i class='" + state.icon + "'></i>&#160;&#160;<span>" + state.text + '</span></span>'
                    );
                }
                else {

                }
                return $state;
            },
        })
        jQuery("#smartSearch").on("select2:select", function (event) {
            console.log(event.params)
            if (event.params.data) {
                if (event.params.data.icon) {
                    controller.searchMood = event.params.data.text
                }
                else if (event.params.data.image) {
                    controller.searchArtist = event.params.data.text
                }
                else {
                    controller.searchWord = event.params.data.text
                }
            }

        });
    }



}
