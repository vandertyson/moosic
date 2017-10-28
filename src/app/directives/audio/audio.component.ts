import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'audio-tag',
    templateUrl: 'app/directives/audio/audio.component.html',
    styleUrls: [
        "app/pages/detail/detail.component.css"
    ],
})
export class PlayComponent implements OnChanges {

    private showPlayer: boolean = false;
    @Input() fileToPlay: string;

    constructor(){
        
    }

    ngOnInit() {
        console.log(this.fileToPlay)
        if (this.fileToPlay != '') {
            this.showPlayer = true;
        }
    }

    ngOnChanges(changes: SimpleChanges ) {
        console.log(changes)
        if (changes['fileToPlay'].previousValue !== changes['fileToPlay'].currentValue && changes['fileToPlay'].currentValue !== '') {
            this.showPlayer = false;
            setTimeout(() => {
                this.showPlayer = true                
            }, 0);

        }
    }
}