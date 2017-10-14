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

  //capturing userFeedback  
  public feedBackInterval: any;
  public feedBackTime = 30000;
  public currentSongScore = 0;

  public updatePlaylist(list, index, name, play?) {
    let controller = this;
    this.stopCurrentSong()
    this.playlist = list;
    this.playlistName = name;
    controller.currentIndex = index;
    controller.currentSong = controller.playlist[controller.currentIndex]
    this.constructHowl(this.playlist, function () {
      controller.playCurrentsong();
    });
  }

  stopCurrentSong() {
    if (this.currentSong && this.currentSong.howl) {
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
      // var per = jQuery("#audio-progress-bar").width() / window.innerWidth
      var sound = this.currentSong.howl;
      // sound.seek(sound.duration() * per)
      sound.play()
    }
    else {

    }
  }


  constructHowl(playlist, callback?) {
    let controller = this;
    var fullyLoaded = this.playlist.length;
    var loaded = 0;
    playlist.forEach(e => {
      var index = playlist.indexOf(e);
      e.howl = new Howl({
        // src: [e.source],
        // src: ["http://data.chiasenhac.com/downloads/1833/2/1832466-b70add48/320/How%20Long%20-%20Charlie%20Puth.mp3"],
        src: ["http://data.chiasenhac.com/downloads/1834/6/1833175-1db3b266/320/September%20Flower%20-%20Touliver_%20Rhymastic_.mp3"],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        autoPlay: false,
        onplay: function () {
          controller.songEllapsed = setInterval(function () {
            controller.ellapsed++
            var per = controller.ellapsed / e.howl.duration()
            controller.setProgressBar.emit(per)
          }, 1000)
          // console.log(this.duration())
          controller.songChange.emit("true")
          controller.startFeedback();
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
          clearInterval(controller.songEllapsed)
          controller.ellapsed = 0
          controller.setProgressBar.emit(0)
          controller.next(null)
        },
        onpause: function () {
          clearInterval(controller.songEllapsed)
        },
        onstop: function () {
          controller.ellapsed = 0
          controller.setProgressBar.emit(0)
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
    var play = this.currentSong.isPlaying ? true : false
    this.stopCurrentSong()
    this.currentIndex++
    if (this.currentIndex == this.playlist.length) {
      this.currentIndex = 0
    }
    this.currentSong = this.playlist[this.currentIndex]
    this.setProgressBar.emit(0)
    if (play) {
      this.playCurrentsong()
    }
  }

  prev(event) {
    var play = this.currentSong.isPlaying ? true : false
    this.stopCurrentSong()
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.playlist.length - 1
    }
    this.currentSong = this.playlist[this.currentIndex]
    // jQuery("#audio-progress-bar").css("width", "0")
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
            alert(controller.currentSong.name + " - score : " + controller.currentSongScore)
          },
          e => {
            alert(controller.currentSong.name + " - score : " + controller.currentSongScore)
          }
        )
      }, controller.feedBackTime)
    // }, controller.feedBackTime)
  }

  sendFeedback() {
    var body = {
      user_id: localStorage.getItem("user_id"),
      track_id: this.currentSong.track_id
    }
    return this.api.post(environment.feedBackUrl, JSON.stringify(body)).map(res => res)
  }

}
