import { Input, Output, Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ViewContainerRef, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';


declare var jQuery: any;

@Component({
    selector: 'tag',
    templateUrl: 'app/directives/tag/tag.component.html',
    styleUrls: [
        'app/directives/tag/tag.component.css',
    ],
    directives: [
        ROUTER_DIRECTIVES,
    ],
    encapsulation: ViewEncapsulation.None,
})

export class TagComponent {
    @Input() data: any;
    @Input() emptyMessage: any;
    @Input() labelClass: any;
    // @Input() nativeStyle: Object = {};
    // @Input() value: any;
    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    // @ViewChild('el') el: ElementRef;

    hanldeOnClick(e: any) {
        e.preventDefault();
        e.stopPropagation();

        // this.click.emit(this.value);
    }
}