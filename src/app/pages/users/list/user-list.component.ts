import {
  Component,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import 'rxjs/Rx';
import { environment } from '../../../environment';
import { RoleToTextPipe } from '../../../pipes/role-to-text.pipe';
import { RoleToColorLabel } from '../../../pipes/role-to-color-label.pipe';
import { APIService } from '../../../auth/APIService';
import { UserListFilter } from '../../../model/filters/user-list.filter.model';
import { DatePipe } from '@angular/common'
import { Loading } from "../../../layouts/partials/loading.component";
import { UserAddComponent, UserAddWindowData } from "../add/user-add.component";
import { UserEditWindowData, UserEditComponent } from "../edit/user-edit.component";
import { PaginationComponent } from '../../../directives/pagination.component'

import {
  Modal,
  // Not used but if not set, TS build errors:
  // Return type of exported function has or is using name 'X'from external module 'Y'
  // but cannot be named.
  BSModal,
  BS_MODAL_PROVIDERS
} from 'angular2-modal/plugins/bootstrap';
import { MessageService } from "../../../services/message-service/message.service";
import { User, UserPostParam } from '../../../model/user.model'

declare var jQuery: any;

@Component({
  selector: 'user-list',
  templateUrl: 'app/pages/users/list/user-list.component.html',
  styleUrls: [
    'assets/css/user-list.component.css'
  ],
  pipes: [
    RoleToTextPipe,
    RoleToColorLabel
  ],
  directives: [
    ROUTER_DIRECTIVES,
    Loading,
    PaginationComponent
  ],
  viewProviders: [...BS_MODAL_PROVIDERS],
  encapsulation: ViewEncapsulation.None
})

export class UserListComponent implements OnInit, OnDestroy, AfterViewInit {
  currentUserList: Object;
  private filter: UserListFilter;
  private sub: any;
  datePipe = new DatePipe();

  errorMessage: string;
  isUserListLoading: boolean;

  constructor(private router: Router,
    private api: APIService,
    private route: ActivatedRoute,
    public modal: Modal,
    viewContainer: ViewContainerRef,
    private message: MessageService) {
    modal.defaultViewContainer = viewContainer;
  }

  ngOnInit() {
    this.currentUserList = [];
    this.filter = {
      search_query: '',
      role: -1, // all
      active: -1, // all
      page: 1,
      per_page: 10,
      sort_by: 'id'
    };

    this.errorMessage = '';
    this.isUserListLoading = false;
  }

  ngAfterViewInit() {
    let controller = this;

    /* @Tuan Anh Dao: This is a workaround of the bug: Expression has changed after it was checked */
    setTimeout(function () {
      controller.filterUserList(null);
    }, 0);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getUserList(filter) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('page', filter.page);
    params.set('perPage', filter.per_page);
    if (filter.sort_by != 'id')
      params.set('sortBy', filter.sort_by);
    if (filter.role != -1)
      params.set('role', filter.role + '');
    if (filter.active != -1)
      params.set('active', filter.active + '');
    if (filter.search_query != '')
      params.set('search', filter.search_query);

    return this.api.get('mock/users.json')
      // this.api.get(environment.getUrl('userListApi'), params, true)
      .map(res => res.json());

  }

  deleteUser(userId, userName) {
    if (!confirm('Are you sure to delete User: ' + userName + ' (#' + userId + ')?'))
      return;
    jQuery('#user-' + userId).hide();

    let params: URLSearchParams = new URLSearchParams();
    return this.api.delete(environment.getUrl('userDeleteApi') + '/' + userId, params)
      .map(res => res.json()).subscribe(
      response => {
      },
      error => {
        jQuery('#user-' + userId).show();
        this.showErrorMessageFromJsonResponse(error);
      }
      );

  }

  editUser(userId) {
    //this.router.navigate(['/users', userId]);
    this.modal.open(UserEditComponent, new UserEditWindowData(userId))
  }

  filterUserList(page): void {
    if (page != null) {
      this.filter.page = 1;
    }
    this.sub = this.route
      .params
      .subscribe(params => {
        this.isUserListLoading = true;

        this.getUserList(this.filter).subscribe(
          userListResponseJson => {
            this.currentUserList = userListResponseJson.result;
            this.filter.page_count = userListResponseJson.page_count;
          },
          error => {
            this.showErrorMessageFromJsonResponse(error);
          },
          () => {
            this.isUserListLoading = false;
          }
        )
      })
  }


  addUser() {
    this.modal.open(UserAddComponent, new UserAddWindowData(""));
  }

  goTo(page: number) {
    if (page > 0 && page <= this.filter.page_count) {
      this.filter.page = page;
      this.filterUserList(null);
    }
  }

  pageChanged() {
    if (this.filter.page > 0 && this.filter.page_count <= this.filter.page_count) {
      this.filterUserList(null);
    }
    this.filterUserList(null);
  }


  getUserInfo(userId) {
    let params: URLSearchParams = new URLSearchParams();
    return this.api.get(environment.getUrl('getUserUrl') + '/' + userId, params)
      .map(res => res.json().result);
  }

  onUserActiveCheckboxChanged(userId: number, active: boolean) {
    var userInfo = new User();
    this.getUserInfo(userId).subscribe(
      response => {
        userInfo = response;
      }
    );
    userInfo.active = !active;
    this.api.put(environment.getUrl('getUserUrl') + '/' + userId, JSON.stringify(userInfo))
      .map(res => res.json())
      .subscribe(
      response => {
      },
      error => {
        this.showErrorMessageFromJsonResponse(error);
        this.message.showErrorMessage(this.errorMessage);
      },
      () => {
      }
      );
  }

  showErrorMessageFromJsonResponse(error: any): void {
    this.errorMessage = error.json().message
      || "Some errors happened with our server. Please try again later";
  }
}

