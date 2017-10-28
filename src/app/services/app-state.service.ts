import { Injectable, EventEmitter } from '@angular/core';
import { User } from '../model/user.model';
import { APIService } from '../auth/APIService';
import { environment } from '../environment';
import { Router } from '@angular/router';
import '../constant/constant';
import { Observable } from 'rxjs/Rx';


declare var jQuery: any;
declare var Howl: any;
declare var Howler: any;

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
  // public playlistChange: Observable<any>;
  public playlistChange = new EventEmitter<any>();

  constructor(private api: APIService, private router: Router) {
    // this.playlistChange = Observable.create(observer => {
    //   observer.next({ "data": "zz" });
    //   // call complete if you want to close this stream (like a promise)
    //   observer.complete();
    // });
  }

  public loginBi() {

  }

  public getUserProfile() {
    this.api.get(environment.getUrl('getProfileUrl')).map(res => res.json().result).subscribe(
      response => {
        this.user_profile = response;
        localStorage.setItem('role_id', this.user_profile.role_id);
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


  ///howler region
  public songEllapsed: any
  public playlist = []
  public playlistName = "Now playing"
  public currentSong: any
  public currentIndex = 0;
  public sounds: any;
  public setProgressBar = new EventEmitter()
  private ellapsed = 0
  public songChange = new EventEmitter();
  public isPausing = false;

  //capturing userFeedback  
  public feedBackInterval: any;
  public feedBackTime = 30000;
  public currentSongScore = 0;
  public currentSrc = ""

  public updatePlaylist(list, index, name, play?, callback?) {
    let controller = this;
    this.playlist = list;
    this.playlistName = name;    
    this.playSong(index)
  }

  playSong(index) {
    this.currentSong = this.playlist[index]
    this.playCurrentsong()
  }

  playCurrentsong() {
    let controller = this;
    if (!this.currentSong) return
    this.currentSrc = this.currentSong.source
    this.playlist.forEach(e=>{
      e.isPlaying = false;
    })
    this.currentSong.isPlaying = true
  }


  next(event) {
    let controller = this;
    controller.songChange.emit(controller.isPausing)
    this.currentIndex++
    if (this.currentIndex == this.playlist.length) {
      this.currentIndex = 0
    }
    this.currentSong = this.playlist[this.currentIndex]
    this.playCurrentsong()

  }

  prev(event) {
    let controller = this;
    controller.songChange.emit(controller.isPausing)
    this.isPausing = false;
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.playlist.length - 1
    }
    this.currentSong = this.playlist[this.currentIndex]
    this.playCurrentsong()
  }

  startFeedback() {
    let controller = this;
    if (this.feedBackInterval) {
      clearInterval(this.feedBackInterval)
      controller.currentSongScore = 0
    }
    // setTimeout(function () {
    controller.feedBackInterval = setInterval(function () {
      controller.currentSongScore++
      controller.sendFeedback().subscribe(
        r => {
          console.log(controller.currentSong.name + " - score : " + controller.currentSongScore)
        },
        e => {
          console.log(controller.currentSong.name + " - score : " + controller.currentSongScore)
        }
      )
    }, controller.feedBackTime)
    // }, controller.feedBackTime)
  }

  sendFeedback() {
    var t = new Date()
    var body = {
      user_id: localStorage.getItem("user_id"),
      track_id: this.currentSong.track_id,
      time: t.getTime()
    }
    return this.api.post(environment.endPoint + environment.feedBackUrl, JSON.stringify(body)).map(res => res)
  }

  pauseCurrentSong() {

  }

}
