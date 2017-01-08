import { Component, AfterViewInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { Auth } from '../../auth/auth';
import { environment } from '../../environment';
import { APIService } from '../../auth/APIService';

declare var jQuery: any;

@Component({
    selector: '[login-page]',
    templateUrl: 'app/pages/login/login.component.html',
    styleUrls: [
        'assets/css/login.component.css'
    ],
    directives: [],
    providers: [APIService, Auth]
})
export class LoginComponent implements AfterViewInit {
    @ViewChildren('input') viewChildren;
    errorMessage: string;
    rememberMe: boolean;
    private email: '';
    private password: '';

    constructor(private router: Router, private api: APIService, private auth: Auth) {
        this.rememberMe = false;
    }

    login(event) {
        event.preventDefault();
        let body = JSON.stringify({
            email: this.email,
            password: this.password
        });
        this.api.get('mock/login.json')
            // this.api.post    (environment.getUrl("loginUrl"), body, null, true)
            .map(res => res.json()).subscribe(
            response => {
                this.auth.login(response.result.token);
                localStorage.setItem("id_nhan_vien", "1");
                this.router.navigate(['/']);
            },
            error => {
                this.showErrorMessageFromJsonResponse(error);
            },
            () => {

            }
            )
    }

    ngAfterViewInit() {
        this.viewChildren.first.nativeElement.focus();
    }

    onChange() {
        console.log(this.rememberMe)
    }

    showErrorMessageFromJsonResponse(error: any): void {
        this.errorMessage = error.json().message
            || "Some errors happened with our server. Please try again later";
    }
}
