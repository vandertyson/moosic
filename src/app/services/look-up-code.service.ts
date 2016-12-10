import { Injectable } from '@angular/core';
import { APIService } from '../auth/APIService';
import { environment } from '../environment';
import '../constant/constant';
import 'rxjs/Rx';


@Injectable()
export class LookUpCodeService {
    constructor(private api: APIService) {

    }


    getLookupCode(constLookUpCode: string) {
        let controller = this;
        return new Promise(function (resolve, reject) {
            var interval = setInterval(function () {
                controller.api.get(environment.getUrl('getLookUpCode') + constLookUpCode)
                    .map(res => res.json())
                    .subscribe(
                    response => {                        
                        resolve({
                            data: response.result
                        })
                        clearInterval(interval);
                    },
                    error => {
                        if (error.status == 419) {
                            clearInterval(interval);
                        }
                        reject()
                    })
            }, 500);
        })
    }
}
