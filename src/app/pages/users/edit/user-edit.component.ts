import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { environment } from '../../../environment';
import { User } from '../../../model/user.model'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import { RoleToTextPipe } from "../../../pipes/role-to-text.pipe";
import { APIService } from "../../../auth/APIService";
import { Observable } from "rxjs/Rx";

import { Loading } from "../../../layouts/partials/loading.component";

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

import 'rxjs/add/observable/fromPromise';
import 'rxjs/Rx';
import {MessageService} from "../../../services/message-service/message.service";

export class UserEditWindowData extends BSModalContext {
    constructor(public userId: number) {
        super();
    }
}

@Component({
  selector: 'user-edit',
  templateUrl: 'app/pages/users/edit/user-edit.component.html',
  pipes: [RoleToTextPipe],
  directives: [REACTIVE_FORM_DIRECTIVES, Loading],  
})

export class UserEditComponent implements OnInit, AfterViewInit, ModalComponent<UserEditWindowData> {
  context: UserEditWindowData;

  private userOldInfo:User = new User();
  private userNewInfo:User = new User();
  private errorMessage:string;
  private sub:any;
  private avatarLink : string = "assets/img/avatar_blank.jpg";
  private isUserLoading: boolean;

  private userEditForm = new FormGroup({
    name: new FormControl(this.userNewInfo.name, Validators.required),
    email: new FormControl(this.userNewInfo.email, Validators.required),
    phone1: new FormControl(this.userNewInfo.phone_1, Validators.required),
    phone2: new FormControl(this.userNewInfo.phone_2),
    role: new FormControl(this.userNewInfo.role_id, Validators.required),
  });


  constructor(private route:ActivatedRoute,
              private router:Router,
              private api:APIService,              
              public dialog: DialogRef<UserEditWindowData>,
              private messageService: MessageService
  ) {
        this.context = dialog.context;
   }

  cancel() {
    this.gotoListUsersInfo();
  }

  gotoListUsersInfo() {
    this.router.navigate(['/users']);
    this.dialog.close();
  }

  ngOnInit() {
    this.isUserLoading = false;
    this.errorMessage = '';
  }

  ngAfterViewInit() {
    let controller = this;
    /* This is a workaround of the bug: Expression has changed after it was checked */
    setTimeout(function(){
      controller.setUserInfo();
    },0);
  }

  setUserInfo() {
    this.sub = this.route.params.subscribe(params => {
        this.isUserLoading = true;
        let id = +params['id'];
        id = this.context.userId;
        this.getUserInfo(id).subscribe(
          userInfo => {
            this.userOldInfo = userInfo;
            this.userNewInfo = userInfo;
          },
          error => {
            this.messageService.showErrorMessage(error);
          },
          () => {
            this.isUserLoading = false;
          })
      });
  }

  getUserInfo(userId) {
    let params:URLSearchParams = new URLSearchParams();
    return this.api.get(environment.getUrl('getUserUrl')+'/'+userId, params)
      .map(res => res.json().result);
  }

  saveUserInfo(event) {
    event.preventDefault();
    if (this.userEditForm.valid) {
      this.api.put(environment.getUrl('getUserUrl')+'/'+this.userNewInfo.id, JSON.stringify(this.userNewInfo))
        .map(res => res.json())
        .subscribe(
          response => {
            this.router.navigate(['/users']);
            this.dialog.close();
            this.messageService.showSuccessMessage("Information saved successfully!");
          },
          error => {
            this.messageService.showErrorMessage(error.json().message);
          },
          () => {
          }
        );
    }
  } 

  avatarChange(input) {
    var tgt = input.target || window.event.srcElement,
      files = tgt.files;
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        document.getElementById("avatar").setAttribute("src", fr.result)
      }
      fr.readAsDataURL(files[0]);
    }
  }
}
