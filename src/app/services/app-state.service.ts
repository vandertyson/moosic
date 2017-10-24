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

  public updatePlaylist(list, index, name, play?, callback?) {
    let controller = this;
    this.stopCurrentSong()
    this.playlist = list;
    this.playlistName = name;
    controller.currentIndex = index;
    controller.currentSong = controller.playlist[controller.currentIndex]
    this.constructHowl(this.playlist, function () {
      //controller.playCurrentsong();

    });
    if (callback) callback();
  }

  stopCurrentSong() {
    if (this.currentSong && this.currentSong.howl) {
      this.currentSong.isPlaying = false
      this.currentSong.howl.stop()
    }
    if (this.songEllapsed) {
      clearInterval(this.songEllapsed)
    }
  }

  playCurrentsong() {
    let controller = this;
    if (!this.currentSong) return
    if (!this.currentSong.howl) return
    if (this.currentSong.howl.state() == "loaded") {
      this.currentSong.isPlaying = true
      // this.duration.innerHTML = controller.formatTime(Math.round(this.currentSong.howl.duration()));      
      var sound = this.currentSong.howl;
      var length = sound.duration();
      var per = this.ellapsed / length;
      sound.seek(length * per)
      sound.play()
    }
  }


  constructHowl(playlist, callback?) {
    let controller = this;
    var fullyLoaded = this.playlist.length;
    var loaded = 0;
    playlist.forEach(e => {
      var index = playlist.indexOf(e);
      e.howl = new Howl({
        src: [e.source],
        // src: ["http://data3.chiasenhac.com/downloads/1781/0/1780309-313f4529/320/Lac%20Troi%20-%20Son%20Tung%20M-TP.mp3"],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        autoPlay: false,
        format: ["mp3"],
        onplay: function () {
          console.log("zz")
          controller.songEllapsed = setInterval(function () {
            controller.ellapsed++
            var per = controller.ellapsed / e.howl.duration()
            controller.setProgressBar.emit(per)
          }, 1000)
          //controller.startFeedback();
        },
        onload: function () {
          if (loaded == controller.currentIndex) {
            controller.playCurrentsong()
          }
          loaded++
          if (loaded == fullyLoaded && callback) {
            callback()
          }

        },
        onloaderror: function (id, err) {
          console.log(err)
        },
        onend: function () {
          clearInterval(controller.songEllapsed)
          controller.ellapsed = 0
          controller.setProgressBar.emit(0)
          controller.next(null)
        },
        onpause: function () {
          controller.isPausing = true
          clearInterval(controller.songEllapsed)
        },
        onstop: function () {
          controller.ellapsed = 0
          controller.setProgressBar.emit(0)
          clearInterval(controller.songEllapsed)
        }
      })
    })
  }

  seek(event, per) {
    let controller = this;
    if (this.currentSong && this.currentSong.howl) {
      var sound = this.currentSong.howl;
      this.ellapsed = Math.floor(sound.duration() * per)
      if (sound.playing()) {
        console.log(sound.duration() * per)
        sound.seek(sound.duration() * per);
      }
    }
  }

  pauseCurrentSong() {
    if (this.currentSong && this.currentSong.howl) {
      this.currentSong.isPlaying = false
      this.currentSong.howl.pause();
    }
  }

  mute(event) {
    Howler.mute(true)
  }

  unMute(event) {
    Howler.mute(false)
  }

  next(event) {
    let controller = this;
    controller.songChange.emit(controller.isPausing)
    this.isPausing = false;
    var play = this.currentSong.isPlaying ? true : false
    this.stopCurrentSong()
    this.currentIndex++
    if (this.currentIndex == this.playlist.length) {
      this.currentIndex = 0
    }
    this.currentSong = this.playlist[this.currentIndex]
    clearInterval(controller.songEllapsed)
    this.setProgressBar.emit(0)
    if (play) {
      this.playCurrentsong()
    }
  }

  prev(event) {
    let controller = this;
    controller.songChange.emit(controller.isPausing)
    this.isPausing = false;
    var play = this.currentSong.isPlaying ? true : false
    this.stopCurrentSong()
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.playlist.length - 1
    }
    this.currentSong = this.playlist[this.currentIndex]
    // jQuery("#audio-progress-bar").css("width", "0")
    clearInterval(controller.songEllapsed)
    this.setProgressBar.emit(0)
    if (play) {
      this.playCurrentsong()
    }
  }

  setVolume(val) {
    Howler.volume(val)
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

}
