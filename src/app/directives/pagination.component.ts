import { Component , Input, Output , EventEmitter} from '@angular/core';

@Component({
    selector: 'pagination-component',
    styleUrls: [
        'assets/css/user-list.component.css'
    ],
    templateUrl: 'app/directives/pagination.component.html',
    inputs:[
        'page'
    ]
  
})

export class PaginationComponent {
     @Input() page: number;
     @Input() page_count: number;
     @Output() pageChange = new EventEmitter();
     goTo(page:number) {
        if (page > 0 && page <= this.page_count) {
            this.page = page;
            this.pageChange.next(this.page);
        } 
    }

}
