import {Injectable, EventEmitter} from '@angular/core';
import {User} from '../model/user.model';
import {APIService} from '../auth/APIService';
import {environment} from '../environment';
import { Router } from '@angular/router';
import '../constant/constant';

declare var jQuery: any;
declare var Sbi: any;

@Injectable()
export class AppStateService {
  public isMainDashBoard = new EventEmitter();
  public analAcvtivated = true;
  public trackAcvtivated = true;
  public geoAcvtivated = true;
  public terriAcvtivated = true;
  public user_profile = new User();
  public avatar_url: string;
  public expirationDate = "28/09/2017";
  public specialCase = false; //need refact

  constructor(private api: APIService, private router: Router) {
        // Sbi.sdk.services.setBaseUrl({
        //     protocol: 'http'
        //     , host: 'skymapglobal.vn'
        //     , port: '8089'
        //     , contextPath: 'SpagoBI'
        //     , controllerPath: 'servlet/AdapterHTTP'
        // });
        // Sbi.sdk.jsonp.timeout = 10000;
  }

  public loginBi() {
        var user = "biadmin";
        var password = "biadmin";
        var cb = function (result, args, success) {
        };
        Sbi.sdk.api.authenticate({
            params: {
                user: user
                , password: password
            }
            , callback: {
                fn: cb
                , scope: this
            }
        });
  }

  public getUserProfile() {
    this.api.get(environment.getUrl('getProfileUrl')).map(res => res.json().result).subscribe(
      response => {        
        this.user_profile = response;
        localStorage.setItem('role_id',this.user_profile.role_id);
        this.avatar_url = this.getAvatar(this.user_profile);
      },
      error => {

      },
      () => {
      }
    );
  }

  public getAvatar(profile) {
    var endPoint = environment.avatarUrl
    return profile.avatar ? endPoint + profile.avatar : avatarDefautlUrl;
  }

  public getUserJoinedDay() {
    if (!this.user_profile.created_at) return "Founder";
    var date = new Date(this.user_profile.created_at.date);
    return 'Member since ' + date.toLocaleDateString();
  }
}
