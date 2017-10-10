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
    private showIntervel:any;

    constructor(private api: APIService, private appState: AppStateService, private router: Router) {
        let controller = this;
    }

    ngAfterViewInit() {
        let controller = this;
        jQuery('.dropdown-menu').click(function (e) {
            e.stopPropagation();
        });
        if(this.appState.currentSong && this.appState.currentSong.isPlaying){
            this.showNow = true;
            jQuery("#showingNow").fadeIn("fast").delay(4000).fadeOut("fast")            
        }
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
        return this.api.get(environment.hotTrendUrl).map(res => res)
    }

    getYouLike() {
        return this.api.get(environment.youLikeUrl).map(res => res)
    }

    getRecent() {
        return this.api.get(environment.recentlyUrl).map(res => res)
    }

    getSearchSong() {
        var url = environment.search1Url
        this.zz++
        if (this.zz % 2 == 0) {
            url = environment.search2Url
        }
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
        // return this.api.get(url, param).map(res => res)
        return this.api.get(url).map(res => res)
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
            this.appState.updatePlaylist(data.playlist, data.startAt, data.playListName, true)
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

}
