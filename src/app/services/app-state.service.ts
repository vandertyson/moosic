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
  private songEllapsed: any
  private playlist = []
  private playlistName = "Now playing"
  private currentSong: any
  private currentIndex = 0;
  public updatePlaylist(list, index, name, play?) {
    let controller = this;
    if (play) {
      controller.stopCurrentSong();
    }
    this.playlist = list;
    this.playlistName = name;
    controller.currentIndex = index;
    controller.currentSong = controller.playlist[controller.currentIndex]
    this.constructHowl(this.playlist, function () {
      if (play) {
        controller.playCurrentsong();
      }
    });
  }

  stopCurrentSong() {
    clearInterval(this.songEllapsed)
    jQuery("#audio-progress-bar").css("width", "0")
    if (this.currentSong.howl) {
      this.currentSong.isPlaying = false
      this.currentSong.howl.stop()
    }
  }

  playCurrentsong() {
    let controller = this;
    if (!this.currentSong) return
    if (!this.currentSong.howl) return
    if (this.currentSong.howl.state() == "loaded") {
      this.currentSong.isPlaying = true
      // this.duration.innerHTML = controller.formatTime(Math.round(this.currentSong.howl.duration()));
      var per = jQuery("#audio-progress-bar").width() / window.innerWidth
      var sound = this.currentSong.howl;
      sound.seek(sound.duration() * per)
      sound.play()
    }
    else {

    }
  }


  constructHowl(playlist, callback?) {
    let controller = this;
    var fullyLoaded = this.playlist.length;
    var loaded = 0;
    var srcList = [];
    playlist.forEach(e => {
      // srcList.push(e.src)
      srcList.push("http://data01.chiasenhac.com/downloads/1730/1/1729694-a4afea05/128/Phia%20Sau%20Mot%20Co%20Gai%20-%20Soobin%20Hoang%20Son.mp3")
    })

    playlist.forEach(e => {
      var index = playlist.indexOf(e);
      e.howl = new Howl({
        // src:[e.source]                
        // src: ["http://192.168.1.15:8000/recommended_system/music.mp3"],
        // src: ["http://data01.chiasenhac.com/downloads/1730/1/1729694-a4afea05/128/Phia%20Sau%20Mot%20Co%20Gai%20-%20Soobin%20Hoang%20Son.mp3"],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        autoPlay: false,
        onplay: function () {
          // controller.songEllapsed = setInterval(function () {
          //   controller.ellapsed++
          //   var per = controller.ellapsed / e.howl.duration()
          //   controller.setProgressBar(per)
          // }, 1000)
        },
        onload: function () {
          loaded++
          if (loaded == fullyLoaded && callback) {
            callback()
          }
        },
        onloaderror: function (id, err) {
          console.log(err)
        },
        onend: function () {
          // clearInterval(controller.songEllapsed)
          // controller.ellapsed = 0
          // controller.setProgressBar(0)
          // controller.next(null)
        },
        onpause: function () {
          clearInterval(controller.songEllapsed)
        },
        onstop: function () {
          // controller.ellapsed = 0
          // controller.setProgressBar(0)
        }
      })
    })
  }
}
