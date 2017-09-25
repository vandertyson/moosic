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
    styleUrls: ['app/pages/home/home.component.css',
        'assets/css/style.css'],
    directives: [MusicPlayer]
})

export class HomeComponent {
    private songs = []
    constructor(private api: APIService) {
        let controller = this;
    }

    ngAfterViewInit() {
        let controller = this;
        this.getHotTrend().subscribe(
            r => {
                this.songs = r.json().result
                setTimeout(function () {
                    jQuery('.responsive').lightSlider({
                        item: 5,
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
                        pauseOnHover: true,
                    });
                    for (var i in controller.songs) {
                        jQuery('#hover' + i).attr('data-tooltip-content', '#show' + i);
                        this.volumeTooltip = jQuery('#hover' + i).tooltipster({
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
        return this.api.get('mock/hot100.json').map(res => res)
    }
}
