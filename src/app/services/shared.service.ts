import { Injectable } from '@angular/core';
import { environment } from '../environment';
import 'rxjs/Rx';

declare var jQuery: any;

@Injectable()
export class SharedService {
    constructor() {

    }

    public removeExcessiveData(object, remainPropName) {
        if (!object)
            return;
        if (!remainPropName || remainPropName.length == 0)
            return;
        var keys = Object.keys(object);
        for (var key of keys) {
            if (remainPropName.indexOf(key) >= 0) {
                continue
            }
            delete object[key];
        }                
    }
}
