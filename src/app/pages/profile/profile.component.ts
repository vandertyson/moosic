import {Component, OnInit, AfterViewInit} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators} from '@angular/forms';
import {RoleToTextPipe} from '../../pipes/role-to-text.pipe';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {environment} from '../../environment';
import 'rxjs/Rx';
import {APIService} from '../../auth/APIService';
import {User, UserPostParam} from "../../model/user.model";
import {Observable} from "rxjs/Rx";
import {MessageService} from "../../services/message-service/message.service";
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap/index';

declare var jQuery: any;

export class UserAddWindowData extends BSModalContext {
  constructor(public userId: string) {
    super();
  }
}

@Component({
  selector: 'profile',
  templateUrl: 'app/pages/profile/profile.component.html',
  directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES],
  pipes: [RoleToTextPipe],
})


export class Profile implements OnInit, AfterViewInit {
  private errorMessage: string;
  private avatarUrl: string = "assets/img/avatar_blank.jpg";
  private userNewInfo = new ProfileModel();
  private submitted: boolean = false;


  constructor(private router: Router,
    private api: APIService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.api.get("mock/profile.json")
      // this.api.get(environment.getUrl('profile'))
      .map(res => res.json()).subscribe(
      res => {
        this.userNewInfo = res;
      },
      error => {

      }
      )
  }

  ngAfterViewInit() {
    let controller = this;
    setTimeout(function () {
      controller.bootstrapDateTime();
    }, 0)
  }

  bootstrapDateTime() {
    let controller = this;
    jQuery('#bday').datetimepicker({
      format: 'YYYY-MM-DD',
      defaultDate: new Date(),
    }).on('dp.change', function (ev) {
     
    });
  }

  onUserSubmitted(event): void {
    event.preventDefault();    
    console.log(this.userNewInfo);
    this.api.post(environment.getUrl('addUserUrl'))
      .map(res => res.json())
      .subscribe(
      response => {
        this.router.navigate(['/']);
        this.messageService.showSuccessMessage("Information saved successfully!")
      },
      error => {
        this.showErrorMessageFromJsonResponse(error);
        this.messageService.showErrorMessage(this.errorMessage);
      },
      () => {
      }
      );
  }

  cancel() {
    this.router.navigate(['/']);
  }

  showErrorMessageFromJsonResponse(error: any): void {
    this.errorMessage = error.json().message
      || "Some errors happened with our server. Please try again later";
  }
}


export class ProfileModel {
  public EmployeeID: any;
  public EmployeeCode: any;
  public FirstName: any;
  public LastName: any;
  public Birthday: any;
  public Gender: any;
  public CMT: any;
  public Email: any;
  public STK: any;
  public BankName: any;
  public Address: any;
  public MST: any;
  public Phone: any;
}