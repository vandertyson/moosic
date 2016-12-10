import { Injectable } from '@angular/core';
import { URLSearchParams, Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { environment } from '../environment';

@Injectable()
export class APIService {
    static isChecking: boolean;
    static current_path = "/";

    constructor(private http: Http, private router: Router) {

    }

    public get(url, params?, jwt = true) {
        if (!params)
            params = new URLSearchParams();

        var contentHeaders = new Headers();
        contentHeaders.append('Accept', 'application/json');
        contentHeaders.append('Content-Type', 'application/json');


        if (jwt) {
            var token = localStorage.getItem('jwt');
            if (token)
                contentHeaders.append('Authorization', 'Bearer' + ' ' + token);
        }

        //noinspection TypeScriptUnresolvedFunction
        return this.http.get(url, { headers: contentHeaders, search: params }).map(res => res).catch((error) => {
            this.checkResponse(error);
            return Observable.throw(error);
        });
    }


    public post(url, body?, params?, jwt = true) {
        if (!params)
            params = new URLSearchParams();

        var contentHeaders = new Headers();
        contentHeaders.append('Accept', 'application/json');
        contentHeaders.append('Content-Type', 'application/json');

        if (jwt) {
            var token = localStorage.getItem('jwt');
            if (token)
                contentHeaders.append('Authorization', 'Bearer' + ' ' + token);
        }
        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(url, body, { headers: contentHeaders, search: params })
            .map(res => res).catch((error) => {
                this.checkResponse(error);
                return Observable.throw(error);
            });
    }

    public put(url, body, params?, jwt = true) {
        if (!params)
            params = new URLSearchParams();

        var contentHeaders = new Headers();
        contentHeaders.append('Accept', 'application/json');
        contentHeaders.append('Content-Type', 'application/json');

        if (jwt) {
            var token = localStorage.getItem('jwt');
            if (token)
                contentHeaders.append('Authorization', 'Bearer' + ' ' + token);
        }
        //noinspection TypeScriptUnresolvedFunction
        return this.http.put(url, body, { headers: contentHeaders, search: params }).map(res => res).catch((error) => {
            this.checkResponse(error);
            return Observable.throw(error);
        });
    }

    public delete(url, params?, jwt = true) {
        if (!params)
            params = new URLSearchParams();

        var contentHeaders = new Headers();
        contentHeaders.append('Accept', 'application/json');
        contentHeaders.append('Content-Type', 'application/json');

        if (jwt) {
            var token = localStorage.getItem('jwt');
            if (token)
                contentHeaders.append('Authorization', 'Bearer' + ' ' + token);
        }
        //noinspection TypeScriptUnresolvedFunction
        return this.http.delete(url, { headers: contentHeaders, search: params }).map(res => res).catch((error) => {
            this.checkResponse(error);
            return Observable.throw(error);
        });
    }

    public uploadFiles(url, body, fileName, params?) {
        if (!params)
            params = new URLSearchParams();

        var contentHeaders = new Headers();
        contentHeaders.append('Accept', 'application/json');
        contentHeaders.append('Content-Type', 'multipart/form-data; boundary=---------------------------7e030ad306c0');
        //contentHeaders.append('Content-Length', body.length);

        var token = localStorage.getItem('jwt');
        if (token)
            contentHeaders.append('Authorization', 'Bearer' + ' ' + token);

        var newBody = '-----------------------------7e030ad306c0\nContent-Disposition: form-data; name="file"; filename="' + fileName + '"\n' +
            "Content-Type: text/csv\n\n" + body + "\n" + "-----------------------------7e030ad306c0--";

        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(url, newBody, { headers: contentHeaders, search: params })
            .map(res => res).catch((error) => {
                this.checkResponse(error);
                return Observable.throw(error);
            });
    }

    public uploadImages(url, body, fileName, params?) {
        if (!params)
            params = new URLSearchParams();

        var contentHeaders = new Headers();
        contentHeaders.append('Accept', 'application/json');
        contentHeaders.append('Content-Type', 'multipart/form-data; boundary=---------------------------7e030ad306c0');
        //contentHeaders.append('Content-Length', body.length);

        var token = localStorage.getItem('jwt');
        if (token)
            contentHeaders.append('Authorization', 'Bearer' + ' ' + token);

        var newBody = '-----------------------------7e030ad306c0\nContent-Disposition: form-data; name="file"; filename="' + fileName + '"\n' +
            "Content-Type: image/jpeg\n\n" + body + "\n" + "-----------------------------7e030ad306c0--";

        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(url, newBody, { headers: contentHeaders, search: params })
            .map(res => res).catch((error) => {
                this.checkResponse(error);
                return Observable.throw(error);
            });
    }

    public uploadFile(url, file, params?) {
        var contentHeaders = new Headers();
        var token = localStorage.getItem('jwt');
        if (token)
            contentHeaders.append('Authorization', 'Bearer' + ' ' + token);

        var formData = new FormData();
        formData.append('file', file);

        return this.http.post(url, formData, { headers: contentHeaders, search: params })
            .map(res => res).catch((error) => {
                this.checkResponse(error);
                return Observable.throw(error);
            });
    }


    private checkResponse(error: any) {
        if (!APIService.isChecking) {
            switch (error.status) {
                case 419:
                    APIService.isChecking = true;
                    alert('Your session expired! Please log in again!');
                    localStorage.removeItem('jwt');
                    APIService.current_path = this.router.routerState.snapshot.url;
                    this.router.navigate(['/login']);    
                    // APIService.isChecking = false;                
                    break;

                case 403:
                    APIService.isChecking = true;
                    alert('This account doesnt have permission for the function');                                        
                    break;
            }
        }
    }
}
