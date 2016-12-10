import {Component, OnInit} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators} from '@angular/forms';
import {RoleToTextPipe} from '../../../pipes/role-to-text.pipe';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {environment} from './../../../environment';
import 'rxjs/Rx';
import {APIService} from '../../../auth/APIService';
import {User, UserPostParam} from "../../../model/user.model";
import {Observable} from "rxjs/Rx";
import {MessageService} from "../../../services/message-service/message.service";

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

export class UserAddWindowData extends BSModalContext {
    constructor(public userId: string) {
        super();
    }
}

@Component({
  selector: 'user-add',
  templateUrl: 'app/pages/users/add/user-add.component.html',
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES ],
  pipes: [RoleToTextPipe],  
})


export class UserAddComponent implements OnInit, ModalComponent<UserAddWindowData> {
  context: UserAddWindowData;

  private errorMessage:string;
  private avatarUrl:string = "assets/img/avatar_blank.jpg";
  private userNewInfo:User = new User();
  private submitted:boolean = false;
  private newUserParam = new UserPostParam();

  private userAddForm = new FormGroup({
    name: new FormControl(this.userNewInfo.name, Validators.required),
    email: new FormControl(this.userNewInfo.email, Validators.required),
    password: new FormControl(this.userNewInfo.password, [Validators.required, Validators.minLength(8)]),
    phone1: new FormControl(this.userNewInfo.phone_1, Validators.required),
    phone2: new FormControl(this.userNewInfo.phone_2),
    role: new FormControl(this.userNewInfo.role_id, Validators.required),
  });


  constructor(private router:Router,
              private api:APIService,              
              public dialog: DialogRef<UserAddWindowData>,
              private messageService: MessageService) {
        this.context = dialog.context;
  }

  ngOnInit(){
    this.userNewInfo.phone_2 = "";
    this.errorMessage = this.context.userId;
  }

  onUserSubmitted(event):void {
    event.preventDefault();
    if (this.userAddForm.valid) {
      this.newUserParam.users = [];
      this.newUserParam.users.push(this.userNewInfo);
      this.api.post(environment.getUrl('addUserUrl'), JSON.stringify(this.newUserParam))
        .map(res => res.json())
        .subscribe(
          response => {
            this.submitted = true;
            this.router.navigate(['/users']);
            this.messageService.showSuccessMessage("Information saved successfully!")
            this.dialog.close();
          },
          error => {
            this.showErrorMessageFromJsonResponse(error);
            this.messageService.showErrorMessage(this.errorMessage);
          },
          () => {
          }
        );
    }
  }
    
  cancel() {
    this.router.navigate(['/users']);
    this.dialog.close();
  }

  hasChanges() {
    for (var control in this.userAddForm.controls) {
      if (!this.userAddForm.controls[control].pristine && this.userAddForm.controls[control].valid) {
        return true;
      }
    }
    return false;
  }

  onSvartarChange(input) {
    var tgt = input.target || window.event.srcElement,
      files = tgt.files;
    // FileReader support
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        document.getElementById("avatar").setAttribute("src", fr.result)
      }
      fr.readAsDataURL(files[0]);
    }
  }

  showErrorMessageFromJsonResponse(error:any):void {
    this.errorMessage = error.json().message
      || "Some errors happened with our server. Please try again later";
  }
}
