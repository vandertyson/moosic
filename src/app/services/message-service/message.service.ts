import {Injectable, EventEmitter} from '@angular/core';
import {MessageType} from "./message.component";

declare var jQuery: any;

@Injectable()
export class MessageService {
  public triggerEvent = new EventEmitter();
  public displayTime = 3000;

  showSuccessMessage(message, ele?) {
    let controller = this;
    let popup = document.createElement('div');
    jQuery('body').append(jQuery(popup));
    jQuery(popup).attr('id', 'messageServicePopup');
    jQuery(popup).addClass('snackbar success');
    jQuery(popup).html(message);
    jQuery(popup).addClass('show');
    setTimeout(function () {
      jQuery(popup).removeClass('show');
      jQuery(popup).remove();
    }, controller.displayTime);
  }

  showErrMessage(message, ele?) {
    let controller = this;
    let popup = document.createElement('div');
    jQuery('body').append(jQuery(popup));
    jQuery(popup).attr('id', 'messageServicePopup');
    jQuery(popup).addClass('snackbar error');
    jQuery(popup).html(message);
    jQuery(popup).addClass('show');
    setTimeout(function () {
      jQuery(popup).removeClass('show');
      jQuery(popup).remove();
    }, controller.displayTime);
  }

  showErrorMessage(elementID, error?) {
    var element = 'body';
    var errorMessage;
    let controller = this;
    try {
      errorMessage = error ? error.json().message
        || "Some errors happened with our server. Please try again later"
        : "Some errors happened with our server. Please try again later"
    }
    catch (err) {
      errorMessage = "Some errors happened with our server. Please try again later";
    }
    finally {
      let popup = document.createElement('div');
      jQuery(element).append(jQuery(popup));
      jQuery(popup).attr('id', 'messageServicePopup');
      jQuery(popup).addClass('snackbar error');
      jQuery(popup).html(errorMessage);      
      jQuery(popup).addClass('show');
      setTimeout(function () {
        jQuery(popup).removeClass('show');
        jQuery(popup).remove();
      }, controller.displayTime);
    }
  }

  createErrorMessage(elementID, message) {
    var element = 'body';
    let controller = this;
    let popup = document.createElement('div');
    jQuery(element).append(jQuery(popup));
    jQuery(popup).attr('id', 'messageServicePopup');
    jQuery(popup).addClass('snackbar error');
    jQuery(popup).html(message);    
    jQuery(popup).addClass('show');
    setTimeout(function () {
      jQuery(popup).removeClass('show');
      jQuery(popup).remove();
    }, controller.displayTime);
  }

  private show(element, appendElement) {
    jQuery(element).append(appendElement);
    jQuery("#kkk").addClass("show");
    setTimeout(function () {
      jQuery("#kkk").removeClass("show");
    }, this.displayTime)
  }
}
